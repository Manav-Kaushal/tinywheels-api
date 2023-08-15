export function slugifyProductName(productName: string) {
  // Remove special characters and replace spaces with dashes
  const slug = productName
    .trim() // Remove leading and trailing whitespaces
    .toLowerCase() // Convert the string to lowercase
    .replace(/[^\w\s-]/g, '') // Remove special characters (leaving only word characters, spaces, and dashes)
    .replace(/\s+/g, '-'); // Replace spaces with dashes

  return slug;
}

export function extractPublicIdFromUrl(url: string, folderName: string) {
  const parts = url.split('/');
  const filenameWithExtension = parts.pop();
  const filenameWithoutExtension = filenameWithExtension.replace(
    /\.(png|svg|jpg)$/i,
    '',
  );
  return `${folderName}/` + filenameWithoutExtension;
}
