export default {
  name: "clientReady",   // event name
  once: true, //only run event once

  //async = wait for event, client is the discord bot
  async execute(client) {

    //test to see in terminal if bot logged in successfully
    console.log(`Logged in as ${client.user.username}!`);

    //show bot status 
    client.user.setActivity("Trivia Time");

    //grab channel id from .env file
    const channelId = process.env.ONLINE_CHANNEL;

    //safety check for missing id
    if (!channelId) {
      console.log("ONLINE_CHANNEL is not set in .env");
      return;
    }

    //grab the channel from discord
    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (channel) { //actual message being sent
  await channel.send({
    content: "# 🎮 TRIVIA TIME! 🎮  \nType **/trivia** to begin!",
    files: [
      "https://www.ignitesocialmedia.com/wp-content/uploads/2018/02/YpJilaXXT8qJR6HQVKFM_ISM_Trivia.gif"
    ]
  });
} else { //in case there is an error/ or id issue/mistake
  console.log("Channel not found — check ID or permissions");
}
  },
};