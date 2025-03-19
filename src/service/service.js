export const updateLoanStackingDetails = async (data) => {
  try {
    const response = await fetch('https://nodeapp.imtest.intainmarkets.us/updateLoanstackingdetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating loan stacking details:', error);
    throw error;
  }
}
