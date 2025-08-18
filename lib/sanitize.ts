export const sanitizeDescription = (description: string | null): string => {
  if (!description) return "No description available";
  // Simple regex to strip HTML tags
  return description.replace(/<[^>]+>/g, "").trim();
};
