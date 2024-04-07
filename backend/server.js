const express = require('express');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(cors());
const port = 80;

latestMeetingUrl = null;

async function generateZoomToken() {
  // @TODO make them environment variables
    const clientId = 'SOqgU3nCSlS9J9Mzh5OeQ';
    const clientSecret = 'IgG8JQKyw6755gJsmzPrRCLFOvkvHGHl';
    
    try {
      const response = await axios.post('https://zoom.us/oauth/token?grant_type=account_credentials&account_id=-kYpvRZKQkqcieUcg6vDvw', {}, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
 
      console.log('Zoom token:', response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Zoom token:', error);
      return null;
    }
  }

  async function createMeeting(token, userId) {
    try {
      const response = await axios.post(`
      https://api.zoom.us/v2/users/${userId}/meetings`, {
        topic: 'Rosa - Médica Virtual',
        type: 1, // 1 for instant meetings
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
  
      return response.data.join_url; // The join URL of the new meeting
    } catch (error) {
      console.error('Error creating meeting:', error);
      return null;
    }
  }

  let chatIdToMeetingLink = {};
  app.post('/create-meeting', express.json(), async (req, res) => {
    const { chatId } = req.body;
  
    // if (!chatId) {
    //   return res.status(400).send('Missing chatId');
    // }
  
    const token = await generateZoomToken();
    const userId = 'urielsosavazquez@gmail.com';
    const joinUrl = await createMeeting(token, userId);
  
    if (joinUrl) {
      // Store the joinUrl for the chatId
      // chatIdToMeetingLink[chatId] = joinUrl;
  
      // Send back the joinUrl and chatId
      res.json({ joinUrl: joinUrl, chatId: chatId });
    } else {
      res.status(500).send('Error creating meeting');
    }
  });

  app.post('/update-chatId', express.json(), async (req, res) => {
    const { chatId } = req.body;
  
    if (!chatId) {
      return res.status(400).send('Missing chatId');
    }
  
    // Update the chatId for the meeting link
    chatIdToMeetingLink[chatId] = chatIdToMeetingLink['oldChatId'];
    delete chatIdToMeetingLink['oldChatId'];
  
    res.status(200).send('ChatId updated successfully');
  });

  app.get('/get-meeting-link', (req, res) => {
    const { chatId } = req.query;
  
    // if (!chatId) {
    //   return res.status(400).send('Missing chatId');
    // }
  
    const joinUrl = chatIdToMeetingLink[chatId];
  
    // if (!joinUrl) {
    //   return res.status(404).send('No meeting link found for this chatId');
    // }
  
    res.json({ joinUrl: joinUrl });
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});