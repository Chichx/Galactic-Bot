const db = require("quick.db");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const { ownerId } = require("../config.json");

// Audit logs
/**
 * @param {String} guildId
 * @param {Object} channel
 */
const setAuditChannel = (guildId, channel) =>
  db.set(`auditchannel_${guildId}`, channel);

/**
 * @param {String} guildId
 */
const getAuditChannel = (guildId) => db.fetch(`auditchannel_${guildId}`);

/**
 * @param {String} guildId
 */
const unsetAuditChannel = (guildId) => db.delete(`auditchannel_${guildId}`);
/**

// level logs
/**
 * @param {String} guildId
 * @param {Object} channel
 */
const setLevelChannel = (guildId, channel) =>
  db.set(`levelchannel_${guildId}`, channel);

/**
 * @param {String} guildId
 */
const getLevelChannel = (guildId) => db.fetch(`levelchannel_${guildId}`);

/**
 * @param {String} guildId
 */
const unsetLevelChannel = (guildId) => db.delete(`levelchannel_${guildId}`);
/**

 *
 * @param {String} guildId
 * @param {Object} channel
 */
const setModLog = (guildId, channel) => db.set(`modlog_${guildId}`, channel);
/**
 *
 * @param {String} guildId
 *
 */
const getModLog = (guildId) => db.fetch(`modlog_${guildId}`);
/**
 *
 * @param {String} guildId
 */
const unsetModLog = (guildId) => db.delete(`modlog_${guildId}`);
/**
 * @param {String} guildId
 * @param {Object} role
 */
const setWelcomeRole = (guildId, role) =>
  db.set(`welcomerole_${guildId}`, role);

/**
 * @param {String} guildId
 */
const getWelcomeRole = (guildId) => db.fetch(`welcomerole_${guildId}`);

/**
 * @param {String} guildId
 */
const unsetWelcomeRole = (guildId) => db.delete(`welcomerole_${guildId}`);

// Blacklist
/**
 * @param {Object} user
 */
const addBlacklistUser = (user) => db.push("blacklist", user);

const getBlacklistUsers = () => db.fetch("blacklist");

/**
 * @param {Array} users
 */
const setBlacklistUsers = (users) => db.set("blacklist", users);

/* warnings */
/**
 * @param {Sting} guildId
 * @param {Object} warnings
 */
const setWarningUsers = (guildId, warnings) =>
  db.set(`warnings_${guildId}`, warnings);

/**
 * @param {String} guildId
 * @param {Object} warning
 */
const addWarningUser = (guildId, warning) =>
  db.push(`warnings_${guildId}`, warning);

/**
 * @param {String} guildId
 */
const getWarningUsers = (guildId) => db.fetch(`warnings_${guildId}`);

/**
 * @param {String} guildId
 * @param {String} word
 */
const addBlacklistWord = (guildId, word) =>
  db.push(`blacklistwords_${guildId}`, word);

/**
 * @param {String} guildId
 * @param {Array} words
 */
const setBlacklistWords = (guildId, words) =>
  db.set(`blacklistwords_${guildId}`, words);

const getBlacklistWords = (guildId) => db.fetch(`blacklistwords_${guildId}`);

module.exports = {
  setAuditChannel,
  getAuditChannel,
  unsetAuditChannel,
  setLevelChannel,
  getLevelChannel,
  unsetLevelChannel,
  setModLog,
  getModLog,
  unsetModLog,
  setWelcomeRole,
  getWelcomeRole,
  unsetWelcomeRole,
  addBlacklistUser,
  getBlacklistUsers,
  setBlacklistUsers,
  setWarningUsers,
  addWarningUser,
  getWarningUsers,
  addBlacklistWord,
  setBlacklistWords,
  getBlacklistWords,
};