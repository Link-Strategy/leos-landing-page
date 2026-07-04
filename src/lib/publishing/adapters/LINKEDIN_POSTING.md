# LinkedIn Posting Adapter

Complete implementation guide for LinkedIn posting functionality.

## Overview

The LinkedIn Posting Adapter enables users to:
- ✅ Publish text posts to LinkedIn
- ✅ Publish posts with images
- ✅ Publish posts with videos
- ✅ Delete published posts
- ✅ Get engagement metrics (likes, comments, shares, impressions)
- ❌ Edit posts (not supported by LinkedIn API)

## Architecture

### Files Created/Modified

1. **LinkedIn Posting Adapter** - [linkedin-posting-adapter.ts](./linkedin-posting-adapter.ts)
   - Implements `PostingAdapter` interface
   - Handles LinkedIn UGC Posts API v2
   - Supports text, image, and video posts

2. **Posting Adapter Factory** - [posting-adapter-factory.ts](./posting-adapter-factory.ts#L272-L285)
   - Added LinkedIn case to factory
   - Handles personUrn formatting

## LinkedIn API Integration

### API Endpoints Used

1. **Create Post** - `POST /v2/ugcPosts`
2. **Delete Post** - `DELETE /v2/shares/{shareUrn}`
3. **Get Metrics** - `GET /v2/socialActions/{shareUrn}`

### Required Scopes

- `openid` - Authentication
- `profile` - Basic profile info
- `email` - User email
- `w_member_social` - Create and manage posts
- `r_organization_social` - Read metrics (analytics)

## Post Formats

### 1. Text-Only Post

```typescript
const adapter = new LinkedInPostingAdapter(token, personUrn);

await adapter.publish({
  title: "My Post Title",
  body: "This is the post content...",
});
```

### 2. Image Post

```typescript
await adapter.publish({
  title: "Check out this image!",
  body: "Here's some additional context",
  media: {
    type: "image",
    url: "https://example.com/image.jpg",
  },
});
```

### 3. Video Post

```typescript
await adapter.publish({
  title: "Watch this video!",
  body: "Video description here",
  media: {
    type: "video",
    url: "https://example.com/video.mp4",
  },
});
```

## LinkedIn URN Format

LinkedIn uses URN (Uniform Resource Name) format for identifying resources:

### Person URN
```
urn:li:person:MEMBER_ID
```

Example: `urn:li:person:abc123XYZ`

### Share URN
```
urn:li:share:POST_ID
urn:li:ugcPost:POST_ID
```

The adapter automatically handles URN formatting.

## Response Format

### Success Response

```typescript
{
  success: true,
  postId: "urn:li:share:1234567890",
  permalink: "https://www.linkedin.com/feed/update/urn:li:share:1234567890"
}
```

### Error Response

```typescript
{
  success: false,
  error: "Error message here"
}
```

## Metrics

The adapter can fetch engagement metrics for published posts:

```typescript
const metrics = await adapter.getMetrics(postId);
// Returns:
// {
//   likes: 45,
//   comments: 12,
//   shares: 8,
//   impressions: 1250,
//   clicks: 89,
//   engagement: 0.052
// }
```

## Limitations

### LinkedIn API Limitations

1. **No Post Editing** - LinkedIn does not allow editing posts after publication
2. **Media Source URL** - Image/video source URLs must be reachable by backend for binary download
3. **Rate Limits** - LinkedIn enforces rate limits (check current limits in docs)
4. **Organization Posts** - Requires additional permissions and different API

### Adapter Limitations

1. **Media Upload** - Uses LinkedIn `assets?action=registerUpload` + binary upload flow
2. **Organization Posting** - Only supports personal posts (not company pages)
3. **Rich Media** - Limited support for documents, articles, polls

## Usage in Post Publishing Flow

### Via Posting Publisher Service

```typescript
import { getPostingAdapterFactory } from "@/shared/infrastructure/services/social/adapters/posting-adapter-factory";

// Create adapter via factory
const factory = getPostingAdapterFactory();
const adapter = await factory.create("linkedin", userId);

// Publish post
const result = await adapter.publish({
  title: "My LinkedIn Post",
  body: "This is the content of my post...",
  hashtags: ["#coding", "#typescript"],
  mentions: ["@johndoe"],
});

if (result.success) {
  console.log("Published to LinkedIn:", result.permalink);
} else {
  console.error("Failed:", result.error);
}
```

### Via Post Domain Service

```typescript
import { postUseCases } from "@/modules/post/application/usecases";

// Publish via domain service (recommended)
const publishUseCase = postUseCases.publish();
await publishUseCase.execute({
  postId: "post_123",
  userId: "user_456",
});
// Automatically publishes to all enabled platforms including LinkedIn
```

## Integration Testing

### 1. Test OAuth Flow

```bash
# Start OAuth flow
GET /api/auth/linkedin/start

# Handle callback
GET /api/auth/linkedin/callback?code=xxx&state=xxx
```

### 2. Test Publishing

```typescript
// Test text post
const result = await adapter.publish({
  title: "Test Post",
  body: "This is a test post from my app",
});
console.assert(result.success === true);

// Test image post
const imageResult = await adapter.publish({
  title: "Test Image",
  body: "Image description",
  media: {
    type: "image",
    url: "https://picsum.photos/800/600",
  },
});
console.assert(imageResult.success === true);
```

### 3. Test Metrics

```typescript
const metrics = await adapter.getMetrics(postId);
console.log("Engagement:", metrics);
```

### 4. Test Delete

```typescript
const deleted = await adapter.delete(postId);
console.assert(deleted === true);
```

## Error Handling

### Common Errors

1. **Invalid Token**
```json
{
  "error": "The token used in the request has been revoked by the user"
}
```
**Solution**: User needs to re-authenticate

2. **Expired Token**
```json
{
  "error": "The token used in the request has expired"
}
```
**Solution**: Refresh token automatically via factory

3. **Insufficient Permissions**
```json
{
  "error": "Not enough permissions to access this resource"
}
```
**Solution**: Request additional scopes during OAuth

4. **Rate Limit**
```json
{
  "error": "Rate limit exceeded"
}
```
**Solution**: Implement retry with exponential backoff

## Best Practices

### 1. Content Formatting

```typescript
// Good - Clear structure
{
  title: "Main Message",
  body: "Additional context and details...\n\nHashtags: #coding #typescript"
}

// Better - Use proper LinkedIn formatting
{
  title: "🚀 Exciting News!",
  body: "We just launched our new feature...\n\nLearn more: https://example.com\n\n#ProductLaunch #Innovation"
}
```

### 2. Hashtag Usage

```typescript
// Include hashtags in body text
const text = `Great article about TypeScript!\n\n#TypeScript #WebDev #Programming`;

await adapter.publish({
  title: "TypeScript Tips",
  body: text,
});
```

### 3. Error Recovery

```typescript
try {
  const result = await adapter.publish(request);

  if (!result.success) {
    // Log error for debugging
    console.error("[LinkedIn] Publish failed:", result.error);

    // Store for retry
    await saveFailedPost({
      platform: "linkedin",
      request,
      error: result.error,
    });
  }
} catch (error) {
  // Handle unexpected errors
  console.error("[LinkedIn] Unexpected error:", error);
  throw error;
}
```

### 4. Token Refresh

The factory automatically handles token refresh:

```typescript
// Token refresh is automatic - factory checks expiration
const adapter = await factory.create("linkedin", userId);
// If token expired, factory will refresh before creating adapter
```

## Media Upload (Advanced)

For production use, implement proper media upload:

```typescript
// 1. Register upload
const uploadUrl = await registerLinkedInUpload(token);

// 2. Upload media
await uploadMediaToLinkedIn(uploadUrl, mediaFile);

// 3. Create post with uploaded media
await adapter.publish({
  title: "Check this out!",
  body: "Description...",
  media: {
    type: "image",
    url: uploadUrl, // Use LinkedIn's uploaded media URL
  },
});
```

## Security Considerations

1. **Token Storage** - Store access tokens encrypted in database
2. **HTTPS Only** - Always use HTTPS for API calls
3. **Validate Input** - Sanitize user input before posting
4. **Rate Limiting** - Implement client-side rate limiting
5. **Error Logging** - Log errors securely without exposing tokens

## References

- [LinkedIn Share API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api)
- [LinkedIn UGC Post API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api)
- [LinkedIn Analytics](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-statistics)
- [LinkedIn Media Upload](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-videos-documents)

## Troubleshooting

### "Invalid person URN"
- Ensure personUrn format is correct: `urn:li:person:MEMBER_ID`
- Check that member ID matches authenticated user

### "Media upload failed"
- Ensure media URL is publicly accessible
- Check file size limits (images: 5MB, videos: 200MB)
- Verify media format is supported

### "Post not found"
- Verify post ID format (URN)
- Check if post was deleted
- Ensure user has access to the post

### "Metrics unavailable"
- Requires `r_organization_social` scope
- May need time for metrics to populate (24-48 hours)
- Check if post is from organization page vs personal profile
