const { Client, MessageEmbed, Intents } = require('discord.js');
const { token, prefix } = require('./config.json');
const ytdl = require("ytdl-core");

const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBER_ADD] });

const queue = new Map();

//Ready//
client.once('ready', () => {
    console.log('Je suis prêt !');
});

//Custom Status//
client.on("ready", () => {
    function randomStatus(){
        let status = ["Turn Rolplay"]
        let rstatus = Math.floor(Math.random() * status.length);
        
        client.user.setActivity(status[rstatus], {type: "PLAYING", url: "https://twitch.tv/"});
    }; setInterval(randomStatus, 2000)
});

//Welcome Message//
client.on("guildMemberAdd", member => {
  let embed = new MessageEmbed ()
      .setDescription(`Ohayo , <@${member.user.id}>`+ "\nBienvenue sur le serveur T U R N ! \nHésite pas a t'amuser, parler de tout et n'importe quoi, fais toi plaiz bg !",) 
      .setFooter("T U R N vous souhaite la bienvenue !")
      .setThumbnail("https://cdn.discordapp.com/attachments/891144548825305129/905029273235095592/standard_2.gif")
      .setColor("050505")
      .setTimestamp()
  member.guild.channels.cache.get('903885832908316752').send(embed)
});


//Commmande Help//
client.on("message", message => {
  if(message.content === prefix + "help"){
      let embed = new MessageEmbed()
          .setColor("060606")
          .setTitle("`📑 | Page d'aide T U R N !`")
          .setDescription("**T U R N est un nouveau bot Discord qui offre de nombreuses fonctionnalités :**\n\n**Le préfixe : t.**\n\n`🎼 Commande pour la Music`\nCes commandes servent à écouter de la musique : `t.p (play)` , `t.fs (skip)` et `t.pause`\n\n`💻 Administration`\nCes commandes sont réservées pour les staffs  : `t.ban`, `t.clear 5` ou `t.c 5` et d'autres qui arrivent dans le futur à venir.\n\n`📚 Général`\nCes commandes servent à inviter le bot ou à rejoindre le serveur ! : `t.invite`, `t.serveur`")
          .setThumbnail("https://cdn.discordapp.com/attachments/891144548825305129/905029273235095592/standard_2.gif")
          .setTimestamp()
          .setFooter("T U R N")
  message.channel.send(embed)
}
})

//Commande Personalisé Invite//
client.on("message", message => {
  if(message.content === prefix + "invite"){
      let embed = new MessageEmbed()
          .setColor("060606")
          .setTitle("Invitation pour le bot !")
          .setDescription("Inviter le bot T U R N dans son serveur discord !")
          .setThumbnail("https://cdn.discordapp.com/attachments/891144548825305129/905029273235095592/standard_2.gif")
          .addFields(
              { name: "Tu trouveras l'invitation du bot juste ci-dessous !", value:"https://discord.com/api/oauth2/authorize?client_id=883224409815531540&permissions=8&scope=bot", inline: true },
              { name: "Merci d'utiliser le bot T U R N !", value: " De la part de tout le staff de TRASH 新 ! ", inline: true },
              )
          .setTimestamp()
          .setFooter("T U R N")
  message.channel.send(embed)
}
})

//Commande Personalisé Serveur//
client.on("message", message => {
  if(message.content === prefix + "serveur"){
      let embed = new MessageEmbed()
          .setColor("060606")
          .setTitle("Serveur Discord Ｔ Ｒ Ａ Ｓ Ｈ 新")
          .setDescription("Ici est l'invitation pour rejoindre le serveur T U R N !")
          .setThumbnail("https://cdn.discordapp.com/attachments/891144548825305129/905029273235095592/standard_2.gif")
          .addFields(
              { name: "Tu trouveras l'invitation du serveur juste ci-dessous !", value:"https://discord.gg/Dg7uHepBbG", inline: true },
              )
          .setTimestamp()
          .setFooter("T U R N")
  message.channel.send(embed)
}
})

//Commande Ban//
client.on('message', message => {
  if(message.content === prefix +"ban"){
  if(!message.guild) return;
  if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Tu la pas le rôle pour executer cette commande !")
  if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("Je n'ai pas les bonnes autorisations.")
  if (message.content.startsWith('t.ban')) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
         */
        member
          .ban({
            reason: 'Ils étaient mauvais !',
          })
          .then(() => {
            message.channel.send(`<@${member.user.id}> a été bannie avec succes`);
          })
          .catch(err => {
            message.channel.send("Je n'ai pas pu bannir le membre !");
            console.error(err);
          });
      } else {
        message.channel.send("Cet utilisateur n'est pas dans cette guilde !");
      }
    } else {
      message.channel.send("Vous n'avez pas mentionné l'utilisateur à bannir !");
    }
  }
 }
});

//Commande Clear//
client.on('message', async (message) => {
  if (
    message.content.toLowerCase().startsWith(prefix + 'clear') ||
    message.content.toLowerCase().startsWith(prefix + 'c ')
  ) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send("You cant use this command since you're missing `manage_messages` perm");
    if (!isNaN(message.content.split(' ')[1])) {
      let amount = 0;
      if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
        amount = 1;
      } else {
        amount = message.content.split(' ')[1];
        if (amount > 100) {
          amount = 100;
        }
      }
      await message.channel.bulkDelete(amount, true).then((_message) => {
        message.channel.send(`Bot clear \`${_message.size}\` messages :broom:`).then((sent) => {
          setTimeout(function () {
            sent.delete();
          }, 2500);
        });
      });
    } else {
      message.channel.send('entrez le nombre de messages que vous souhaitez effacer').then((sent) => {
        setTimeout(function () {
          sent.delete();
        }, 2500);
      });
    }
  } else {
    if (message.content.toLowerCase() === prefix + 'help clear') {
      const newEmbed = new Discord.MessageEmbed().setColor('#060606').setTitle('**Clear Help**');
      newEmbed
        .setDescription('Cette commande efface les messages par exemple `i.clear 5` ou `i.c 5`.')
        .setFooter(`Demandé par ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp();
      message.channel.send(newEmbed);
    }
  }
});

//Commande Music//
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) {
          return;
  }
  if (!message.content.startsWith(prefix)) {
          return;
  }

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}p`)) {
          execute(message, serverQueue); // On appel execute qui soit initialise et lance la musique soit ajoute à la queue la musique
          return;
  }
  else if (message.content.startsWith(`${prefix}fs`)) {
          skip(message, serverQueue); // Permettra de passer à la musique suivante
          return;
  }
  else if (message.content.startsWith(`${prefix}stop`)) {
          stop(message, serverQueue); // Permettra de stopper la lecture
          return;
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" "); // On récupère les arguments dans le message pour la suite

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) // Si l'utilisateur n'est pas dans un salon vocal
  {
          return message.channel.send(
              "Vous devez être dans un salon vocal!"
          );
  }
  const permissions = voiceChannel.permissionsFor(message.client.user); // On récupère les permissions du bot pour le salon vocal
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) { // Si le bot n'a pas les permissions
          return message.channel.send(
              "J'ai besoin des permissions pour rejoindre le salon et pour y jouer de la musique!"
          );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url : songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
          const queueConstruct = {
                  textChannel : message.channel,
                  voiceChannel: voiceChannel,
                  connection  : null,
                  songs       : [],
                  volume      : 1,
                  playing     : true,
          };

          // On ajoute la queue du serveur dans la queue globale:
          queue.set(message.guild.id, queueConstruct);
          // On y ajoute la musique
          queueConstruct.songs.push(song);

          try {
                  // On connecte le bot au salon vocal et on sauvegarde l'objet connection
                  var connection           = await voiceChannel.join();
                  queueConstruct.connection = connection;
                  // On lance la musique
                  play(message.guild, queueConstruct.songs[0]);
          }
          catch (err) {
                  //On affiche les messages d'erreur si le bot ne réussi pas à se connecter, on supprime également la queue de lecture
                  console.log(err);
                  queue.delete(message.guild.id);
                  return message.channel.send(err);
          }
  }
  else {
          serverQueue.songs.push(song);
          console.log(serverQueue.songs);
          return message.channel.send(`${song.title} has been added to the queue!`);
  }

}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
  {
          return message.channel.send(
              "Vous devez être dans un salon vocal pour passer une musique!"
          );
  }
  if (!serverQueue) // On vérifie si une musique est en cours
  {
          return message.channel.send("Aucune lecture de musique en cours !");
  }
  serverQueue.connection.dispatcher.end(); // On termine la musique courante, ce qui lance la suivante grâce à l'écoute d'événement
                                           // finish
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) // on vérifie que l'utilisateur est bien dans un salon vocal pour skip
  {
          return message.channel.send(
              "Vous devez être dans un salon vocal pour stopper la lecture!"
          );
  }
  if (!serverQueue) // On vérifie si une musique est en cours
  {
          return message.channel.send("Aucune lecture de musique en cours !");
  }
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  console.log(song);
  const serverQueue = queue.get(guild.id); // On récupère la queue de lecture
  if (!song) { // Si la musique que l'utilisateur veux lancer n'existe pas on annule tout et on supprime la queue de lecture
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
  }
  // On lance la musique
  const dispatcher = serverQueue.connection
      .play(ytdl(song.url, { filter: 'audioonly' }))
      .on("finish", () => { // On écoute l'événement de fin de musique
              serverQueue.songs.shift(); // On passe à la musique suivante quand la courante se termine
              play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
  dispatcher.setVolume(1); // On définie le volume
  serverQueue.textChannel.send(`Démarrage de la musique: **${song.title}**`);
}

client.login(token);