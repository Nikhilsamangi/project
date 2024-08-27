import Cookies from 'js-cookie';
import axios from 'axios';
export const handleExport = async (startDate, endDate, format) => {
  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }
  
  const token = Cookies.get('accessToken');
  const query = new URLSearchParams({ startDate, endDate, format }).toString();

  try {
    const response = await axios({
      url: `http://localhost:5001/api/expenses/export?${query}`,
      method: 'GET',
      responseType: 'blob', // Important for handling binary data
      headers: {
        'Content-Type': 'application/json',
        'authToken': token, // Send auth token if needed
      },
    });

    // Create a URL for the Blob object
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.${format === 'csv' ? 'csv' : 'xlsx'}`;
    
    // Append the link to the body
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Failed to export data. Please try again.');
  }
};