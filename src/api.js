import JsonClient from "./JsonApi";

export class ApiProvider extends JsonClient {

    logout() {
        var asyncUser = this.logoutAndChangeUser();
        this.user = asyncUser;
    }

    async logoutAndChangeUser() {
        await this.fetchMethod("logout/");
        var user = await this.getUserInfo();
        return user;
    }

    async kickPlayer({ sid, playername, reason, playerId }) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("changeplayer", {
                "request": "kickPlayer",
                "playername": playername,
                "playerid": playerId,
                "serverid": sid,
                "reason": reason
            });
        }
        return await this.postJsonMethod("changeplayer", {
            "request": "kickPlayer",
            "playername": playername,
            "serverid": sid,
            "reason": reason
        });
    }

    async globalBanPlayer({ name, reason, gid, playerId}) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("addautoban", {
                "playername": name,
                "playerid": playerId,
                "groupid": gid,
                "reason": reason
            });
        }
        return await this.postJsonMethod("addautoban", {
            "playername": name,
            "groupid": gid,
            "reason": reason
        });
    }

    async globalUnbanPlayer({ name, gid, id, reason }) {
        if ((reason !== undefined) && (reason !== "")) {
            return await this.postJsonMethod("delautoban", {
                "playerid": id,
                "playername": name,
                "groupid": gid,
                "reason": reason
            });
        }
        return await this.postJsonMethod("delautoban", {
            "playerid": id,
            "playername": name,
            "groupid": gid,
            "reason": ""
        });
    }


    async globalExcludePlayer({ name, reason, gid, playerId}) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("addexcludedplayer", {
                "playername": name,
                "playerid": playerId,
                "groupid": gid,
                "reason": reason
            });
        }
        return await this.postJsonMethod("addexcludedplayer", {
            "playername": name,
            "groupid": gid,
            "reason": reason
        });
    }

    async globalRemoveExcludePlayer({ name, gid, id, reason }) {
        if ((reason !== undefined) && (reason !== "")) {
            return await this.postJsonMethod("delexcludedplayer", {
                "playerid": id,
                "playername": name,
                "groupid": gid,
                "reason": reason
            });
        }
        return await this.postJsonMethod("delexcludedplayer", {
            "playerid": id,
            "playername": name,
            "groupid": gid,
            "reason": ""
        });
    }

    async changeRotation({ sid, map }) {
        return await this.postJsonMethod("changelevel", {
            "mapnumber": map,
            "serverid": sid
        });
    }

    async banPlayer({ name, reason, time, sid, playerId, oid, platformId }) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("changeserver", {
                "request": "addServerBan",
                "playername": name,
                "playerid": playerId,
                "serverid": sid,
                "bantime": time.toString(),
                "oid": oid,
                "platformid": platformId,
                "reason": reason
            });
        }
        return await this.postJsonMethod("changeserver", {
            "request": "addServerBan",
            "playername": name,
            "serverid": sid,
            "bantime": time.toString(),
            "reason": reason
        }); 
    }

    async unbanPlayer({ name, reason, sid, playerId, oid, platformId }) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("changeserver", {
                "request": "removeServerBan",
                "playername": name,
                "playerid": playerId,
                "serverid": sid,
                "oid": oid,
                "platformid": platformId,
                "reason": reason
            });
        }
        return await this.postJsonMethod("changeserver", {
            "request": "removeServerBan",
            "playername": name,
            "serverid": sid,
            "reason": reason
        });
    }

    async addVip({ sid, name, reason }) {
        return await this.postJsonMethod("changeserver", {
            "request": "addServerVip",
            "playername": name,
            "serverid": sid,
            reason
        });
    }

    async removeVip({ sid, name, reason, playerId }) {
        if ((playerId !== undefined) && (playerId !== "")) {
            return await this.postJsonMethod("changeserver", {
                "request": "removeServerVip",
                "playername": name,
                "playerid": playerId,
                "serverid": sid,
                reason
            });
        }
        return await this.postJsonMethod("changeserver", {
            "request": "removeServerVip",
            "playername": name,
            "serverid": sid,
            reason
        });
    }

    async movePlayer({ sid, team, name }) {
        return await this.postJsonMethod("moveplayer", {
            "teamid": team,
            "playername": name,
            "serverid": sid
        });
    }

    async getBanList({ sid }) {
        return await this.getJsonMethod("infolist", {
            "type": "bannedList",
            "serverid": sid
        });
    }

    async getStarterList({ sid }) {
        return await this.getJsonMethod("firestarters", {
            "serverid": sid
        });
    }
    
    async getPlayTimeList({ sid }) {
        return await this.getJsonMethod("playingscoreboard", {
            "serverid": sid
        });
    }
    
    async getSpectatorList({ sid }) {
        return await this.getJsonMethod("spectators", {
            "serverid": sid
        });
    }
    
    async getPlayerLogList({ sid, date, searchPlayer }) {
        return await this.getJsonMethod("playerlog", {
            "serverid": sid,
            "date": date,
            "playername": searchPlayer
        });
    }


    async getAutoBanList({ gid }) {
        return await this.getJsonMethod("autoban", {
            "groupid": gid
        });
    }

    async getExcludedPlayers({ gid }) {
        return await this.getJsonMethod("excludedplayers", {
            "groupid": gid
        });
    }

    async getVipList({ sid }) {
        return await this.getJsonMethod("infolist", {
            "type": "vipList",
            "serverid": sid
        });
    }

    async getCookieList({ sid }) {
        return await this.getJsonMethod("cookielist", {
            "serverid": sid
        });
    }

    async getAdminList({ sid }) {
        return await this.getJsonMethod("infolist", {
            "type": "adminList",
            "serverid": sid
        });
    }

    async getServerLogs({ sid }) {
        return await this.getJsonMethod("tailserverlog", {
            "serverid": sid
        });
    }

    async getGroupLogs({ gid }) {
        return await this.getJsonMethod("tailuserlog", {
            "groupid": gid
        });
    }

    async getDevGroups() {
        var devGroups = await this.getJsonMethod("devgroups");
        if ("error" in devGroups) {
            throw Error("Error on server.");
        }
        return devGroups;
    }

    async getManGroups() {
        var devGroups = await this.getJsonMethod("mangroups");
        if ("error" in devGroups) {
            throw Error("Error on server.");
        }
        return devGroups;
    }

    async addGroup({ groupName, discordId, modRole, adminRole, sid, remid, supportedGame }) {
        return await this.postJsonMethod("addgroup", {
            "groupname": groupName,
            "adminroleid": adminRole,
            "discordid": discordId,
            "modroleid": modRole,
            "remid": remid,
            "sid": sid,
            "supportedgame": supportedGame,
        });
    }

    async removeGroup({ gid }) {
        return await this.postJsonMethod("delgroup", {
            "groupId": gid,
        });
    }

    async addCookie({ gid, sid, remid, defaultCookie, supportedGame }) {
        return await this.postJsonMethod("addcookie", {
            "sid": sid,
            "remid": remid,
            "groupid": gid,
            "defaultcookie": defaultCookie,
            "supportedgame": supportedGame
        })
    }

    async editCookie({ gid, sid, remid, id, defaultCookie, supportedGame }) {
        return await this.postJsonMethod("editcookie", {
            "cookieid": id,
            "sid": sid,
            "remid": remid,
            "groupid": gid,
            "defaultcookie": defaultCookie,
            "supportedgame": supportedGame
        });
    }

    async removeCookie({ gid, id }) {
        return await this.postJsonMethod("delcookie", {
            "cookieid": id,
            "groupid": gid
        })
    }

    async editGroup({ gid, type, value }) {
        var answer = await this.postJsonMethod("editgroup", {
            "groupid": gid,
            "values": value
        });
        if ("error" in answer) {
            throw new Error(answer.error.message)
        }
    }

    async getGroup(gid) {
        return await this.getJsonMethod("groups", { "groupid": gid });
    }

    async getStats(gid) {
        return await this.getJsonMethod("stats", { "groupid": gid });
    }

    async getServerStats(sid) {
        return await this.getJsonMethod("serverstats", { "serverid": sid });
    }

    async addGroupOwner({ gid, uid, nickname }) {
        return await this.postJsonMethod("addowner", {
            "userid": uid, // discord userid
            "nickname": nickname, // will change when the user signs in
            "groupid": gid,
        });
    }

    async addGroupServer({ gid, name, alias, game }) {
        return await this.postJsonMethod("addserver", {
            "servername": name,
            "serveralias": alias,
            "groupid": gid,
            "game": game
        });
    }

    async addGroupAdmin({ gid, uid, nickname }) {
        return await this.postJsonMethod("addadmin", {
            "userid": uid, // discord userid
            "nickname": nickname, // will change when the user signs in
            "groupid": gid,
        });
    }

    async removeGroupAdmin({ gid, uid }) {
        return await this.postJsonMethod("deladmin", {
            "userid": uid,
            "groupid": gid,
        });
    }

    async removeGroupOwner({ gid, uid }) {
        return await this.postJsonMethod("delowner", {
            "userid": uid,
            "groupid": gid,
        });
    }

    async setupOps({ server, sid, remid }) {
        return await this.postJsonMethod("makeoperations", {
            "serverid": server,
            "sid": sid,
            "remid": remid,
        });
    }


    async getServer(sid) {
        return await this.getJsonMethod("server", { "serverid": sid });
    }

    async getServerGame(sid) {
        var game = await this.getJsonMethod("servers", { "serverid": sid });
        if ("error" in game.data[0]) {
            throw Error(game.data[0].error);
        } else {
            return game;
        }
    }

    async removeServer({ sid }) {
        return await this.postJsonMethod("delserver", {
            "serverid": sid,
        });
    }

    async renameServer({ name, sid }) {
        return await this.postJsonMethod("renameserver", {
            "serverid": sid,
            "servername": name,
        });
    }

    async changeServerAlias({ gid, alias, sid }) {
        return await this.postJsonMethod("serveralias", {
            "serverid": sid,
            "groupid": gid,
            "serveralias": alias,
        });
    }

    async editServer({ sid, value }) {
        var answer = await this.postJsonMethod("editserver", {
            "serverid": sid,
            "values": value
        });
        if ("error" in answer) {
            throw new Error(answer.error.message)
        }
    }

    async editOwnerSever({sid, remid, cookieid, serverid, maps}) {
        console.log(maps);
        if (sid === "" || remid === "") {
            sid = undefined;
            remid = undefined;
        } else {
            cookieid = undefined;
        }
        const sendMaps = []
        maps.forEach(element => {
            sendMaps.push({"gameMode": element.mode, "mapName": element.mapname})
        });
        var answer = await this.postJsonMethod("changeownerserver", {
            "sid": sid,
            "remid": remid,
            "cookieid": cookieid,
            "serverid": serverid,
            "maps": sendMaps
        });
        if ("error" in answer) {
            throw new Error(answer.error.message)
        }
    }


    async restartWorker({ sid }) {
        var answer = await this.postJsonMethod("restartworker", {
            "serverid": sid
        });
        if ("error" in answer) {
            throw new Error(answer.error.message)
        }
    }

    async manEditGroup({ gid, value }) {
        var answer = await this.postJsonMethod("maneditgroup", {
            "groupid": gid,
            "values": value
        });
        if ("error" in answer) {
            throw new Error(answer.error.message)
        }
    }
    
    async getSeeding(gid) {
        return await this.getJsonMethod("getseeder", { "groupid": gid });
    }

    async getSeeders(gid) {
        return await this.getJsonMethod("seeders", { "groupid": gid });
    }

    async getServerAliases(gid) {
        return await this.getJsonMethod("serveraliasname", { "groupid": gid });
    }

    async setSeeding({ serverName, serverId, action, groupId, rejoin, message }) {
        return await this.postJsonMethod("seeder", {
            "servername": serverName,
            "serverid": serverId,
            "action": action,
            "groupid": groupId,
            "rejoin": rejoin,
            "message": message
        });
    }

    async addKeepAlive({ serverId, hostname }) {
        return await this.postJsonMethod("addkeepalive", {
            "serverid": serverId,
            "hostname": hostname
        });
    }
    
    async delKeepAlive({ serverId, hostname }) {
        return await this.postJsonMethod("delkeepalive", {
            "serverid": serverId,
            "hostname": hostname
        });
    }

    async scheduleSeeding({timeStamp, serverName, groupId}) {
        return await this.postJsonMethod("seederschedule", {
            "timestamp": timeStamp,
            "servername": serverName,
            "groupid": groupId
        });
    }

    async undoScheduleSeeding({groupId}) {
        return await this.postJsonMethod("undoseederschedule", {
            "groupid": groupId
        });
    }
}

export const OperationsApi = new ApiProvider();