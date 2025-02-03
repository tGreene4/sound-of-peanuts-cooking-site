const { onCall } = require('firebase-functions/v2/https');
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();

exports.postcomment = onCall(async (data, context) => {
    try {
        const { handle, comment } = data.data;
        logger.info("Received a comment post request", { handle, comment });
        if (!handle || !comment) {
            throw new Error('Missing handle or comment in request data.');
        }
        // Save the data in Firestore
        const res = await db.collection('comments').add({ handle, comment });
        logger.info('Document added with ID:', res.id);
        // Return a success response
        return { success: true, message: 'Document added successfully.', documentId: res.id };
    } catch (error) {
        logger.error('Error adding comment:', error);
        // Return an error response
        return { success: false, message: 'Failed to add comment.', error: error.message };
    }
});
