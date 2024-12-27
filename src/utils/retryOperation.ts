/**
 * Utility function to retry an asynchronous operation a specified number of times with a delay.
 *
 * @param operation - The asynchronous operation to retry.
 * @param retries - The number of retry attempts (default is 3).
 * @param delay - The delay between retries in milliseconds (default is 1000ms).
 * @returns The result of the operation if successful.
 * @throws The error from the operation if all retry attempts fail.
 */
export const retryOperation = async <T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === retries) throw error; // If all attempts fail, throw the error
            console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
        }
    }
    throw new Error("Retry operation failed unexpectedly."); // Should not reach here
};
