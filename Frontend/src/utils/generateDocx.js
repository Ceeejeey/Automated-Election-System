import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  WidthType,
} from "docx";

const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64.split(",")[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const generateDocx = async (election, viewType, canvasRef) => {
  const docContent = [];

  docContent.push(
    new Paragraph({
      text: election.title,
      heading: HeadingLevel.HEADING1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: `Duration: ${new Date(election.startDate).toLocaleDateString()} - ${new Date(election.endDate).toLocaleDateString()}`,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: " " })
  );

  if (viewType === "graph" && canvasRef.current) {
    const canvas = canvasRef.current.querySelector("canvas");
    const imgDataUrl = canvas.toDataURL("image/png");
    const image = new ImageRun({
      data: base64ToUint8Array(imgDataUrl),
      transformation: {
        width: 500,
        height: 300,
      },
    });
    docContent.push(new Paragraph({ children: [image], alignment: AlignmentType.CENTER }));
  } else if (viewType === "table") {
    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Candidate")],
            }),
            new TableCell({
              children: [new Paragraph("Votes")],
            }),
            new TableCell({
              children: [new Paragraph("Party")],
            }),
          ],
        }),
        ...election.candidates.map((c) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(c.name || "N/A")],
              }),
              new TableCell({
                children: [new Paragraph(String(c.votes ?? 0))],
              }),
              new TableCell({
                children: [new Paragraph(c.party || "N/A")],
              }),
            ],
          })
        ),
      ],
    });

    docContent.push(table);
  }

  const doc = new Document({ sections: [{ children: docContent }] });
  const blob = await Packer.toBlob(doc);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${election.title.replace(/\s+/g, "_")}_Results.docx`;
  link.click();
};
