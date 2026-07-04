const fs = require('fs');
const path = require('path');
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (error) {
  for (const entry of (process.env.PATH || '').split(path.delimiter)) {
    const normalized = entry.split('\\').join('/');
    if (!normalized.endsWith('/node_modules/.bin')) {
      continue;
    }
    try {
      puppeteer = require(path.join(path.dirname(entry), 'puppeteer'));
      break;
    } catch (nestedError) {
      // Try the next npx-provided node_modules directory.
    }
  }
  if (!puppeteer) {
    throw error;
  }
}
const config = JSON.parse(Buffer.from('eyJodG1sUGF0aCI6ICJcXFxca2lyYS1yb2dcXFVzZXJzXFxraXJhN1xcRGVza3RvcFxcd29ya3NwYWNlXFxsZW9zLWxhbmRpbmctcGFnZVxcLmNhY2hlXFxtZC1wZGZcXExhbmRpbmdBZ2VudC1Gb3ItTWVkaWEtNjA2NjE5ZTY0MVxcTGFuZGluZ0FnZW50LUZvci1NZWRpYS5yZW5kZXJlZC5odG1sIiwgImpzb25SZXBvcnRQYXRoIjogIlxcXFxLSVJBLVJPR1xcVXNlcnNcXGtpcmE3XFxEZXNrdG9wXFx3b3Jrc3BhY2VcXGxlb3MtbGFuZGluZy1wYWdlXFwuY2FjaGVcXExhbmRpbmdBZ2VudC1Gb3ItTWVkaWEucGFnaW5hdGlvbi5qc29uIiwgIm1hcmtkb3duUmVwb3J0UGF0aCI6ICJcXFxcS0lSQS1ST0dcXFVzZXJzXFxraXJhN1xcRGVza3RvcFxcd29ya3NwYWNlXFxsZW9zLWxhbmRpbmctcGFnZVxcLmNhY2hlXFxMYW5kaW5nQWdlbnQtRm9yLU1lZGlhLnBhZ2luYXRpb24ubWQiLCAicGRmT3V0cHV0UGF0aCI6ICJcXFxcS0lSQS1ST0dcXFVzZXJzXFxraXJhN1xcRGVza3RvcFxcd29ya3NwYWNlXFxsZW9zLWxhbmRpbmctcGFnZVxcLmRvY3NcXExhbmRpbmdBZ2VudFxcTGFuZGluZ0FnZW50LUZvci1NZWRpYS5wZGYiLCAicGFnZSI6IHsiZm9ybWF0IjogIkE0IiwgIndpZHRoTW0iOiAyMTAsICJoZWlnaHRNbSI6IDI5NywgIm1hcmdpbk1tIjogeyJ0b3AiOiAxMCwgInJpZ2h0IjogMTIsICJib3R0b20iOiAxMCwgImxlZnQiOiAxMn0sICJjb250ZW50V2lkdGhNbSI6IDE4NiwgImNvbnRlbnRIZWlnaHRNbSI6IDI3NywgInB4UGVyTW0iOiAzLjc3OTUyNzU1OTA1NTExODV9LCAiZXN0aW1hdGVEZWNpc2lvbnMiOiBbeyJpbmRleCI6IDAsICJ0aXRsZSI6ICJQcmVhbWJsZSIsICJlc3RpbWF0ZWRfd2VpZ2h0X2xpbmVzIjogMC43NSwgImFjY3VtdWxhdGVkX2JlZm9yZV9saW5lcyI6IDAuMCwgImluc2VydGVkX2JyZWFrX2JlZm9yZSI6IGZhbHNlLCAiaGFzX3RhYmxlX29yX2ltYWdlIjogZmFsc2UsICJoYXNfbWFudWFsX2JyZWFrIjogZmFsc2UsICJyZWFzb25zIjogW119LCB7ImluZGV4IjogMSwgInRpdGxlIjogIiMjIFRcdTAwZTBpIGxpXHUxZWM3dSBkXHUwMGUwbmggY2hvIG5oXHUwMGUybiB2aVx1MDBlYW4gdHJ1eVx1MWVjMW4gdGhcdTAwZjRuZyIsICJlc3RpbWF0ZWRfd2VpZ2h0X2xpbmVzIjogMi4wLCAiYWNjdW11bGF0ZWRfYmVmb3JlX2xpbmVzIjogMC43NSwgImluc2VydGVkX2JyZWFrX2JlZm9yZSI6IGZhbHNlLCAiaGFzX3RhYmxlX29yX2ltYWdlIjogZmFsc2UsICJoYXNfbWFudWFsX2JyZWFrIjogZmFsc2UsICJyZWFzb25zIjogW119LCB7ImluZGV4IjogMiwgInRpdGxlIjogIiMjIDEuIExhbmRpbmdBZ2VudCBsXHUwMGUwIGdcdTAwZWM/IiwgImVzdGltYXRlZF93ZWlnaHRfbGluZXMiOiA2LjUsICJhY2N1bXVsYXRlZF9iZWZvcmVfbGluZXMiOiAzLjc1LCAiaW5zZXJ0ZWRfYnJlYWtfYmVmb3JlIjogZmFsc2UsICJoYXNfdGFibGVfb3JfaW1hZ2UiOiBmYWxzZSwgImhhc19tYW51YWxfYnJlYWsiOiBmYWxzZSwgInJlYXNvbnMiOiBbXX0sIHsiaW5kZXgiOiAzLCAidGl0bGUiOiAiIyMgMi4gTlx1MWVjMW4gdFx1MWVhM25nIHNcdTFlZWQgZFx1MWVlNW5nOiBBbnRpZ3Jhdml0eSBBZ2VudCBDaGF0Ym94IiwgImVzdGltYXRlZF93ZWlnaHRfbGluZXMiOiAzNS4wLCAiYWNjdW11bGF0ZWRfYmVmb3JlX2xpbmVzIjogMTEuMjUsICJpbnNlcnRlZF9icmVha19iZWZvcmUiOiBmYWxzZSwgImhhc190YWJsZV9vcl9pbWFnZSI6IHRydWUsICJoYXNfbWFudWFsX2JyZWFrIjogZmFsc2UsICJyZWFzb25zIjogW119LCB7ImluZGV4IjogNCwgInRpdGxlIjogIiMjIDMuIEJcdTAwZWFuIHRyb25nIEFnZW50OiBSdWxlcywgU2tpbGxzLCBXb3JrZmxvd3MiLCAiZXN0aW1hdGVkX3dlaWdodF9saW5lcyI6IDAuNSwgImFjY3VtdWxhdGVkX2JlZm9yZV9saW5lcyI6IDQ3LjI1LCAiaW5zZXJ0ZWRfYnJlYWtfYmVmb3JlIjogZmFsc2UsICJoYXNfdGFibGVfb3JfaW1hZ2UiOiBmYWxzZSwgImhhc19tYW51YWxfYnJlYWsiOiB0cnVlLCAicmVhc29ucyI6IFtdfSwgeyJpbmRleCI6IDUsICJ0aXRsZSI6ICIjIyA0LiBDXHUwMGUxYyB0XHUwMGVkbmggblx1MDEwM25nIGNoXHUwMGVkbmgiLCAiZXN0aW1hdGVkX3dlaWdodF9saW5lcyI6IDI4LjAsICJhY2N1bXVsYXRlZF9iZWZvcmVfbGluZXMiOiAwLjUsICJpbnNlcnRlZF9icmVha19iZWZvcmUiOiBmYWxzZSwgImhhc190YWJsZV9vcl9pbWFnZSI6IGZhbHNlLCAiaGFzX21hbnVhbF9icmVhayI6IGZhbHNlLCAicmVhc29ucyI6IFtdfSwgeyJpbmRleCI6IDYsICJ0aXRsZSI6ICIjIyA1LiBIXHUwMWIwXHUxZWRibmcgZFx1MWVhYm4gc1x1MWVlZCBkXHUxZWU1bmcgaFx1MDBlMG5nIG5nXHUwMGUweSIsICJlc3RpbWF0ZWRfd2VpZ2h0X2xpbmVzIjogMC41LCAiYWNjdW11bGF0ZWRfYmVmb3JlX2xpbmVzIjogMjkuNSwgImluc2VydGVkX2JyZWFrX2JlZm9yZSI6IGZhbHNlLCAiaGFzX3RhYmxlX29yX2ltYWdlIjogZmFsc2UsICJoYXNfbWFudWFsX2JyZWFrIjogdHJ1ZSwgInJlYXNvbnMiOiBbXX0sIHsiaW5kZXgiOiA3LCAidGl0bGUiOiAiIyMgNi4gSGlcdTFlYzduIHRyXHUxZWExbmcgJiBMXHUxZWQ5IHRyXHUwMGVjbmgiLCAiZXN0aW1hdGVkX3dlaWdodF9saW5lcyI6IDI1LjUsICJhY2N1bXVsYXRlZF9iZWZvcmVfbGluZXMiOiAwLjUsICJpbnNlcnRlZF9icmVha19iZWZvcmUiOiBmYWxzZSwgImhhc190YWJsZV9vcl9pbWFnZSI6IHRydWUsICJoYXNfbWFudWFsX2JyZWFrIjogZmFsc2UsICJyZWFzb25zIjogW119LCB7ImluZGV4IjogOCwgInRpdGxlIjogIiMjIDcuIExcdTFlZTNpIFx1MDBlZGNoIGNobyBuaFx1MDBlMm4gdmlcdTAwZWFuIHRydXlcdTFlYzFuIHRoXHUwMGY0bmciLCAiZXN0aW1hdGVkX3dlaWdodF9saW5lcyI6IDAuNSwgImFjY3VtdWxhdGVkX2JlZm9yZV9saW5lcyI6IDI3LjAsICJpbnNlcnRlZF9icmVha19iZWZvcmUiOiBmYWxzZSwgImhhc190YWJsZV9vcl9pbWFnZSI6IGZhbHNlLCAiaGFzX21hbnVhbF9icmVhayI6IHRydWUsICJyZWFzb25zIjogW119LCB7ImluZGV4IjogOSwgInRpdGxlIjogIiMjIDguIEhcdTFlY2ZpIFx1MDExMVx1MDBlMXAgbmhhbmgiLCAiZXN0aW1hdGVkX3dlaWdodF9saW5lcyI6IDEzLjAsICJhY2N1bXVsYXRlZF9iZWZvcmVfbGluZXMiOiAwLjUsICJpbnNlcnRlZF9icmVha19iZWZvcmUiOiBmYWxzZSwgImhhc190YWJsZV9vcl9pbWFnZSI6IGZhbHNlLCAiaGFzX21hbnVhbF9icmVhayI6IGZhbHNlLCAicmVhc29ucyI6IFtdfV19', 'base64').toString('utf8'));

const pxPerMm = config.page.pxPerMm;
const pageWidthPx = Math.round(config.page.contentWidthMm * pxPerMm);
const pageHeightPx = config.page.contentHeightMm * pxPerMm;

function mm(px) {
  return Math.round((px / pxPerMm) * 10) / 10;
}

function esc(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: pageWidthPx, height: Math.round(pageHeightPx), deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(config.htmlPath), { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.evaluate(() => document.fonts && document.fonts.ready);

  const result = await page.evaluate((unscaledPageHeightPx, pxPerMm) => {
    const printScale = 0.75;
    const pageHeightPx = unscaledPageHeightPx * printScale;
    const scaledPxPerMm = pxPerMm * printScale;

    // Table Compression logic (must run first so DOM shifts are measured correctly)
    const maxTableHeightPx = pageHeightPx * 0.8;
    document.querySelectorAll('table').forEach((table) => {
      let rect = table.getBoundingClientRect();
      let height = rect.height * printScale;
      
      if (height > maxTableHeightPx) {
        table.style.fontSize = '10px';
        table.style.lineHeight = '1.25';
        table.querySelectorAll('td, th').forEach((cell) => {
          cell.style.padding = '3px 5px';
        });
        
        rect = table.getBoundingClientRect();
        height = rect.height * printScale;
        
        if (height > maxTableHeightPx) {
          table.style.fontSize = '9px';
          table.style.lineHeight = '1.15';
          table.querySelectorAll('td, th').forEach((cell) => {
            cell.style.padding = '2px 3px';
          });
        }
      }
    });

    const anchors = Array.from(document.querySelectorAll('.layout-anchor'));
    const pageBreaks = Array.from(document.querySelectorAll('.page-break'));

    function round(value) {
      return Math.round(value * 10) / 10;
    }

    // Converts scaled pixels to mm using 72 DPI conversion
    function mm(value) {
      return round(value / scaledPxPerMm);
    }

    // Create a list of all markers with their raw scroll position
    const markers = [];
    anchors.forEach((anchor) => {
      const rect = anchor.getBoundingClientRect();
      markers.push({
        type: 'anchor',
        element: anchor,
        y: rect.top + window.scrollY,
      });
    });
    pageBreaks.forEach((pb) => {
      const rect = pb.getBoundingClientRect();
      markers.push({
        type: 'break',
        element: pb,
        y: rect.top + window.scrollY,
      });
    });
    
    // Sort markers by their raw vertical scroll position, prioritizing page breaks when coordinates match
    markers.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 0.1) {
        return a.type === 'break' ? -1 : 1;
      }
      return a.y - b.y;
    });
    
    let currentShift = 0;
    const shiftedSections = new Map();
    const shiftedBreaks = [];
    const heightCalibration = 0.88;
    
    markers.forEach((marker) => {
      const scaledY = marker.y * printScale * heightCalibration;
      const shiftedY = scaledY + currentShift;
      
      if (marker.type === 'break') {
        const p = Math.floor(Math.max(shiftedY - 0.1, 0) / pageHeightPx) + 1;
        const nextPageTop = p * pageHeightPx;
        const shift = nextPageTop - shiftedY;
        currentShift += shift;
        shiftedBreaks.push({
          topPx: shiftedY + shift,
          pageBefore: p,
          pageAfter: p + 1,
        });
      } else {
        const anchor = marker.element;
        const index = Number(anchor.dataset.sectionIndex);
        const nextAnchor = anchors.find(a => Number(a.dataset.sectionIndex) === index + 1);
        
        const range = document.createRange();
        range.setStartBefore(anchor);
        if (nextAnchor) {
          range.setEndBefore(nextAnchor);
        } else {
          range.setEndAfter(document.body.lastChild || document.body);
        }
        const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
        const top = rects.length ? Math.min(...rects.map((rect) => rect.top + window.scrollY)) : anchor.offsetTop;
        const bottom = rects.length ? Math.max(...rects.map((rect) => rect.bottom + window.scrollY)) : top;
        const height = Math.max(bottom - top, 0);
        
        shiftedSections.set(index, {
          anchor,
          top: marker.y * printScale * heightCalibration + currentShift,
          height: height * printScale * heightCalibration,
        });
      }
    });

    const sections = anchors.map((anchor) => {
      const index = Number(anchor.dataset.sectionIndex);
      const data = shiftedSections.get(index);
      if (!data) return null;
      
      const top = data.top;
      const height = data.height;
      const bottom = top + height;
      
      function pageNo(y) {
        return Math.floor(Math.max(y, 0) / pageHeightPx) + 1;
      }
      
      const startPage = pageNo(top);
      const endPage = pageNo(Math.max(bottom - 0.1, top));
      const topInPage = top - (startPage - 1) * pageHeightPx;
      const bottomInPage = bottom - (endPage - 1) * pageHeightPx;
      const pageShare = height / pageHeightPx;
      const whitespaceBefore = topInPage;
      const firstPageRemaining = pageHeightPx - topInPage;
      const title = anchor.dataset.title || 'Preamble';

      let recommendation = 'ok';
      let actionHint = 'No action needed.';
      if (height > pageHeightPx * 0.95) {
        recommendation = 'split section or reduce table/image height';
        actionHint = `Split "## ${title}" into smaller ### subsections, split long tables, or reduce large image/diagram height.`;
      } else if (startPage !== endPage && firstPageRemaining < pageHeightPx * 0.25) {
        recommendation = 'insert page break before this section';
        actionHint = `Add <div class="page-break"></div> immediately before "## ${title}".`;
      } else if (startPage !== endPage) {
        recommendation = 'review internal split';
        actionHint = `Review "## ${title}" around the page boundary; add a page break before it only if the split hurts readability.`;
      } else if (whitespaceBefore > pageHeightPx * 0.78) {
        recommendation = 'consider page break before section';
        actionHint = `Consider adding <div class="page-break"></div> before "## ${title}" if this heading appears too low on the page.`;
      }

      return {
        index,
        title,
        topPx: round(top),
        bottomPx: round(bottom),
        heightPx: round(height),
        heightMm: mm(height),
        pageShare: round(pageShare),
        startPage,
        endPage,
        topInPageMm: mm(topInPage),
        bottomInPageMm: mm(bottomInPage),
        firstPageRemainingMm: mm(firstPageRemaining),
        crossesPage: startPage !== endPage,
        recommendation,
        actionHint,
      };
    }).filter(s => s !== null);

    const docBottom = Math.max(...sections.map(s => s.bottomPx), pageHeightPx);

    const manualBreaks = shiftedBreaks.map((b, index) => {
      return {
        index: index + 1,
        topPx: round(b.topPx),
        topMm: mm(b.topPx),
        pageBefore: b.pageBefore,
        pageAfter: b.pageAfter,
      };
    });

    const pagesInfo = [];
    for (let p = 1; p <= Math.ceil(docBottom / pageHeightPx); p++) {
      const yStart = (p - 1) * pageHeightPx;
      const yEnd = p * pageHeightPx;
      let maxBottomInPagePx = 0;
      
      sections.forEach((section) => {
        if (section.topPx < yEnd && section.bottomPx > yStart) {
          const localBottom = Math.min(section.bottomPx, yEnd) - yStart;
          if (localBottom > maxBottomInPagePx) {
            maxBottomInPagePx = localBottom;
          }
        }
      });
      
      const fillPercent = Math.min(Math.round((maxBottomInPagePx / pageHeightPx) * 100), 100);
      const fillHeightMm = mm(maxBottomInPagePx);
      pagesInfo.push({
        page: p,
        fillHeightMm,
        fillPercent,
      });
    }

    return {
      measuredAt: new Date().toISOString(),
      pageHeightPx: round(pageHeightPx),
      pageHeightMm: mm(pageHeightPx),
      documentHeightPx: round(docBottom),
      documentHeightMm: mm(docBottom),
      estimatedPages: Math.ceil(docBottom / pageHeightPx),
      sections,
      manualBreaks,
      pagesInfo,
    };
  }, pageHeightPx, pxPerMm);

  result.page = config.page;
  result.estimateDecisions = config.estimateDecisions;
  fs.writeFileSync(config.jsonReportPath, JSON.stringify(result, null, 2), 'utf8');

  const lines = [];
  lines.push('# PDF Pagination Report');
  lines.push('');
  lines.push(`- Page: ${config.page.format} content ${config.page.contentWidthMm}mm x ${config.page.contentHeightMm}mm`);
  lines.push(`- Estimated pages from rendered HTML: ${result.estimatedPages}`);
  lines.push(`- Document height: ${mm(result.documentHeightPx)}mm`);
  lines.push('');
  lines.push('## Action Queue');
  lines.push('');
  const actionItems = result.sections.filter((section) => section.recommendation !== 'ok');
  if (actionItems.length === 0) {
    lines.push('- No pagination risks detected.');
  } else {
    for (const section of actionItems) {
      lines.push(`- Section ${section.index} "${section.title}": ${section.recommendation}. Size ${section.heightMm}mm, starts on page ${section.startPage} at ${section.topInPageMm}mm with ${section.firstPageRemainingMm}mm remaining.`);
      lines.push(`  Suggested fix: ${section.actionHint}`);
    }
  }
  lines.push('');
  lines.push('## Sections');
  lines.push('');
  lines.push('| # | Section | Size | Pages | Start offset | First page left | Crosses page | Recommendation | Action |');
  lines.push('|---:|---|---:|---|---:|---:|---|---|---|');
  for (const section of result.sections) {
    lines.push(`| ${section.index} | ${esc(section.title)} | ${section.heightMm}mm (${section.pageShare}p) | ${section.startPage}-${section.endPage} | ${section.topInPageMm}mm | ${section.firstPageRemainingMm}mm | ${section.crossesPage ? 'yes' : 'no'} | ${esc(section.recommendation)} | ${esc(section.actionHint)} |`);
  }
  lines.push('');
  lines.push('## Page Fill Rates');
  lines.push('');
  lines.push('| Page | Content Height | Fill Rate (%) | Status |');
  lines.push('|---:|---|---|---|');
  for (const page of result.pagesInfo) {
    let status = 'Ideal';
    if (page.fillPercent < 40) {
      status = 'Underfilled (Risk of blank space)';
    } else if (page.fillPercent > 95) {
      status = 'Almost Full';
    }
    lines.push(`| ${page.page} | ${page.fillHeightMm}mm | ${page.fillPercent}% | ${status} |`);
  }
  lines.push('');
  lines.push('## Break Points');
  lines.push('');
  if (result.manualBreaks.length === 0) {
    lines.push('- No `.page-break` elements were rendered.');
  } else {
    lines.push('| # | Position | Estimated page | Offset in page |');
    lines.push('|---:|---:|---:|---:|');
    for (const item of result.manualBreaks) {
      const offsetMm = Math.round(((item.topPx % result.pageHeightPx) / config.page.pxPerMm) * 10) / 10;
      lines.push(`| ${item.index} | ${item.topMm}mm | ${item.pageBefore} | ${offsetMm}mm |`);
    }
  }
  lines.push('');
  lines.push('## Smart Layout Decisions');
  lines.push('');
  lines.push('| # | Section | Est. lines | Before | Break | Reason |');
  lines.push('|---:|---|---:|---:|---|---|');
  for (const decision of config.estimateDecisions) {
    lines.push(`| ${decision.index} | ${esc(decision.title)} | ${decision.estimated_weight_lines} | ${decision.accumulated_before_lines} | ${decision.inserted_break_before ? 'yes' : 'no'} | ${esc((decision.reasons || []).join(', '))} |`);
  }
  fs.writeFileSync(config.markdownReportPath, lines.join('\n') + '\n', 'utf8');
  await page.pdf({
    path: config.pdfOutputPath,
    format: config.page.format,
    printBackground: true,
    margin: {
      top: config.page.marginMm.top + 'mm',
      right: config.page.marginMm.right + 'mm',
      bottom: config.page.marginMm.bottom + 'mm',
      left: config.page.marginMm.left + 'mm',
    }
  });
  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
