const cheerio = require("cheerio");
const axios = require("axios");

async function render_html_to_pdf(doc, html) {
  const $ = cheerio.load(html);

  $("h1").each((index, element) => {
    doc.fontSize(24).text($(element).text());
  });

  $("p").each((index, element) => {
    doc.fontSize(12).text($(element).text());
  });

  const imgElements = $("img");

  for (let i = 0; i < imgElements.length; i++) {
    const imgSrc = $(imgElements[i]).attr("src");
    try {
      if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
        const response = await axios.get(imgSrc, {
          responseType: "arraybuffer",
        });
        const imageData = Buffer.from(response.data, "binary");
        doc.image(imageData, { width: 250 });
      } else {
        doc.image(imgSrc, { width: 200 });
      }
    } catch (error) {
      console.error(`Error fetching image from ${imgSrc}:`, error.message);
    }
  }

  $("table").each((index, element) => {
    const rows = $(element).find("tr");
    rows.each((rowIndex, rowElement) => {
      const cells = $(rowElement).find("td");
      cells.each((cellIndex, cellElement) => {
        const cellText = $(cellElement).text();
        doc.text(cellText, cellIndex * 100, rowIndex * 20);
      });
    });
  });

  $("ul, ol").each((index, element) => {
    const listItems = $(element).find("li");
    listItems.each((itemIndex, itemElement) => {
      const listItemText = $(itemElement).text();
      doc.text(`• ${listItemText}`, 50, itemIndex * 20);
    });
  });

  $("a").each((index, element) => {
    const linkUrl = $(element).attr("href");
    const linkText = $(element).text();
    doc.text(linkText, { link: linkUrl, underline: true });
  });
}

module.exports = {
  render_html_to_pdf,
};
