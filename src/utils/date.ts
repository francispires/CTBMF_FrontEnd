export function formatDate(date: string) {
  const dateObj = new Date(date);

  const result = dateObj.toLocaleString('pt-BR', {
    dateStyle: "short"
  });
  
  return result;
}