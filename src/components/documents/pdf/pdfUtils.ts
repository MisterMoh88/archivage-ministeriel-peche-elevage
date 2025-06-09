
export const downloadFile = (url: string, filename: string) => {
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    return false;
  }
};

export const openInNewTab = (url: string) => {
  window.open(url, '_blank');
};

export const createGoogleDocsViewerUrl = (fileUrl: string) => {
  return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};
