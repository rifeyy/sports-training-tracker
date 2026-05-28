import jsPDF from "jspdf";

export const generateClientPDF = (data: any) => {
  const doc = new jsPDF();

  // ✅ Logo
  const logo = "/logo.png";

  // NOTE: jsPDF ما كيقراش path مباشرة، خاص base64
  // نخليو simple version:
  doc.setFontSize(20);
  doc.text("AthleteOS", 10, 10);

  doc.setFontSize(14);
  doc.text("Client Report", 10, 18);

  let y = 30;

  doc.setFontSize(12);
  doc.text(`Name: ${data.name}`, 10, y); y += 8;
  doc.text(`Goal: ${data.goal}`, 10, y); y += 8;
  doc.text(`Activity: ${data.activity}`, 10, y); y += 10;

  doc.text(`Weight: ${data.weight} kg`, 10, y); y += 8;
  doc.text(`BMI: ${data.bmi}`, 10, y); y += 8;
  doc.text(`Calories: ${data.calories} kcal`, 10, y); y += 10;

  // ✅ History table
  doc.setFontSize(14);
  doc.text("History", 10, y);
  y += 10;

  data.history?.forEach((item: any) => {
    doc.setFontSize(10);
    doc.text(
      `W:${item.weight}kg | BMI:${item.bmi} | ${item.date}`,
      10,
      y
    );
    y += 6;
  });

  
  // ✅ CHART IMAGE
  const canvas = document.querySelector("canvas");
  if (canvas) {
    const img = canvas.toDataURL("image/png");
    doc.addImage(img, "PNG", 10, 120, 180, 60);
  }
 doc.save("athleteos-pro-report.pdf");
};

