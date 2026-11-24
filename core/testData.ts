function createUniqueEmail(): string {
  const uniquePart = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return `qa_${uniquePart}@example.com`;
}

export { createUniqueEmail };
