//------ MODULE INFO
// This module enables converting HTTP codes from the API into words that make clear what is happening.
// The API Services use this module to communicate more effectively with the Error page.
// Imported by: apiService, authService

export const errorCodes = {
    200: null,
    201: null,
    204: null,
    400: "duplicate",
    401: "anonymous",
    403: "permission",
    404: "unknown",
    405: "dependency",
    500: "api"
}