interface ErrorWithMessage {
  message: string;
  details?: unknown;
}

export const handleError = (context: string, error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const errorDetails = (error as ErrorWithMessage).details;
  
  console.error(context + ':', {
    message: errorMessage,
    details: errorDetails,
    error
  });
};

export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};