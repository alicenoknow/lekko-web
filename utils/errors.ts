interface ApiError {
    error_type: string;
    details: readonly ApiError[] | string;
}

// function getErrorMessageFromDetails(details: string) {
//     switch (details) {
//         case '':
//             break;
//         case '':
//             break;
//         default:
//     }
// }

// export function getErrorMessage(error: ApiError) {
//     const errorMessage = '';

//     if (Array.isArray(error?.details)) {
//     }
// }
