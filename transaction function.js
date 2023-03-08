async function createTicketOrDeleteExisting(db, ticketData) {
  const ticketRef = db.collection('tickets').doc();
  const phone = ticketData['Customer\'s Phone'];
  const description = ticketData['Description'];
  const date = ticketData['Date'];

  try {
    await db.runTransaction(async (transaction) => {
      // Check if a document with the specified fields exists
      const querySnapshot = await transaction.get(db.collection('tickets').where('Customer\'s Phone', '==', phone).where('Description', '==', description).where('Date', '==', date));
      
      if (!querySnapshot.empty) {
        // If a document exists, delete it
        const docToDelete = querySnapshot.docs[0];
        transaction.delete(docToDelete.ref);
        console.log(`Deleted existing ticket with id ${docToDelete.id}`);
      } else {
        // If no document exists, create a new one
        transaction.set(ticketRef, ticketData);
        console.log(`Created new ticket with id ${ticketRef.id}`);
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating/deleting ticket:', error);
    return { success: false, error };
  }
}

//Running the functions ==============================
const ticketData = {
  'Customer\'s Phone': '555-1234',
  'Description': 'Fix leaky faucet',
  'Date': '2023-03-08',
  // Add any other fields here as needed
};

createTicketOrDeleteExisting(db, ticketData)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
