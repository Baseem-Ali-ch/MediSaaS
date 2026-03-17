import path from "path";
import fs from "fs";

export const loadTemplate = async (templateName: string, data: any) => {
  const templatePath = path.join(process.cwd(), "templates", templateName);

  let html = fs.readFileSync(templatePath, "utf-8");

  Object.entries(data).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  });

  return html;
};
