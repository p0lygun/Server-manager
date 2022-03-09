import React, { useState, useContext } from "react";
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { ServerUnbanPlayer, ServerUnvipPlayer } from "./Modals";
import { PageContext } from "./ServerGlobalContext";
import { useMeasure } from 'react-use';

import buttonStyle from "../components/Buttons.module.css";
import { Button, ButtonRow, ButtonUrl, TextInput } from "../components/Buttons";
import { DynamicSort } from "../components/Functions";
import { Row } from "../components/Flex";
import { useModal } from "../components/Card";


import { OperationsApi } from "../api";

import '../locales/config';

import styles from "./Styles.module.css";



import { PlayerStatsModal } from "./Modals";



export function SmallText(props) {
    return (<span className={styles.SmallText}>{props.children}</span>);
}



export function EditableText(props) {
    return (<p>{props.children}</p>);
}

export function SettingsRow(props) {
    return <div className={styles.SettingsRow}>{props.children}</div>;
}

export function SmallIntInput(props) {
    return <input type="text" className={styles.SmallInput} defaultValue={props.value} />;
}

export function ServerInfo(props) {
    var server = props.server;
    return (
        <>
        </>
    );
}

export function ServerRotation(props) {
    const { t } = useTranslation();
    var server = null, game = null;
    if (props.game && props.game.data && props.game.data.length > 0) {
        server = props.game.data[0];
        game = server.info;
    }

    var server_status = (
        <span className={styles.serverBadgePending}>
            {t("serverStatus.pending")}
        </span>
    );

    if (server) {
        if (server.isAdmin) {
            server_status = (
                <span className={styles.serverBadgeOk}>
                    <span className={styles.liveUpdate}></span>
                    {t("serverStatus.running")}
                </span>
            )
        } else {
            server_status = (
                <span className={styles.serverBadgeErr}>
                    {t("serverStatus.noAdmin")}
                </span>
            )
        }
        if (server.serverStatus === "noServer") {
            server_status = (
                <span className={styles.serverBadgeErr}>
                    {t("serverStatus.noServer")}
                </span>
            )
        }
    }
    var update_timestamp = new Date().getTime();
    if (server) {
        update_timestamp = new Date(server.update_timestamp);
    }
    var [rotationId, setRotationId] = useState("");
    const [playerListSort, setPlayerListSort] = useContext(PageContext);
    const [serverInfoRef, { width }] = useMeasure();

    return (
        <div ref={serverInfoRef} className={styles.ServerInfoColumn}>
            <div className={styles.ServerDescriptionRow}>
                <img className={styles.serverImage} alt="Server map" src={(game) ? game.url : "/img/no-server-image.png"} />
                <div className={styles.GameInfo}>
                    <span className={styles.ServerName}>{(game) ? game.prefix : t("loading")}</span>
                    <SmallText>{(game) ? `${game.map} - ${t(`gamemodes.${game.mode}`)} - ${game.serverInfo} ${t("server.game.info", { inQue: game.inQue })}` : "-"}</SmallText>
                    {width > 400 ?
                        <>
                            <span className={styles.serverBadge}>{server_status} - {t("server.game.playerlistUpdate")} {t("change", { change: update_timestamp })} ago</span>
                        </>
                        : <></>}
                </div>
            </div>
            {width <= 400 ?
                <>
                    <span className={styles.serverBadge}>{server_status} - {t("server.game.playerlistUpdate")} {t("change", { change: update_timestamp })} ago</span>
                    <div style={{ padding: "5px" }} />
                </>
                : <div style={{ paddingTop: "5px" }} />}
            {server && server.game === "bf1" ? (
                <>
                    <ButtonRow>
                        <Button name={t("server.game.restart")} disabled={!game} callback={_ => props.rotate((game) ? game.rotationId : null)} />
                        <select className={styles.SwitchGame} value={rotationId} onChange={e => setRotationId(e.target.value)}>
                            <option value="">{t("server.game.mapSwitch")}</option>
                            {(game) ? game.rotation.map((value, i) =>
                                <option value={value.index} key={i}>{value.mapname} - {t(`gamemodes.${value.mode}`)}</option>
                            ) : ""}
                        </select>
                        {(rotationId !== "") ? <Button name={t("apply")} disabled={!game} callback={_ => { props.rotate((game) ? rotationId : null); setRotationId(""); }} /> : ""}
                    </ButtonRow>
                    <ButtonRow>
                        <select className={styles.SwitchGame} value={playerListSort} onChange={e => setPlayerListSort(e.target.value)}>
                            <option value="position">{t("server.players.sort.main")}</option>
                            <option value="position">{t("server.players.sort.position")}</option>
                            <option value="-ping">{t("server.players.sort.ping")}</option>
                            <option value="name">{t("server.players.sort.name")}</option>
                            <option value="-rank">{t("server.players.sort.rank")}</option>
                            <option value="joinTime">{t("server.players.sort.joinTime")}</option>
                        </select>
                    </ButtonRow>
                </>
            ) : (<></>)}
        </div>
    );
}



export function ServerInfoHolder(props) {
    return (
        <div className={styles.ServerInfoRow}>
            {props.children}
        </div>
    );
}

export function BanList(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: banList, error } = useQuery('serverBanList' + sid, () => OperationsApi.getBanList({ sid }));

    const [searchWord, setSearchWord] = useState("");
    const [sorting, setSorting] = useState("displayName");

    const modal = useModal();
    const showUnban = e => {
        let playerInfo = e.target.dataset
        modal.show(
            <ServerUnbanPlayer
                sid={sid}
                playerInfo={playerInfo}
            />
        );
    }

    if (!banList) {
        // TODO: add fake item list on loading
        return t("loading");
    } else {
        banList.data = banList.data.sort(DynamicSort(sorting));
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }

    return (
        <div>
            <h5>
                {t("server.banList.description0")}<br />
                {t("server.banList.description1")} <b>{t("server.banList.description2", { number: banList.data.length })}</b>.
                {t("server.banList.description3")}<br />{t("server.banList.description4")}
            </h5>
            <ButtonRow>
                <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                <ButtonUrl href={`https://manager-api.gametools.network/api/infoexcel?type=bannedList&serverid=${props.sid}`} name={t("export")} />
            </ButtonRow>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <th onClick={_ => setSorting("displayName")}>{t("server.banList.table.playerName")}</th>
                        <th onClick={_ => setSorting("id")}>{t("server.banList.table.playerId")}</th>
                        <th onClick={_ => setSorting("-reason")}>{t("server.banList.table.reason")}</th>
                        <th onClick={_ => setSorting("-admin")}>{t("server.banList.table.admin")}</th>
                        <th onClick={_ => setSorting("-unixBanTimeStamp")}>{t("server.banList.table.until")}</th>
                        <th onClick={_ => setSorting("-unixBanUntilTimeStamp")}>{t("server.banList.table.timestamp")}</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {
                            banList.data.filter(p => p.displayName.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<BanRow player={player} key={i} callback={showUnban} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function BanRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();
    return (
        <tr className={styles.BanRow} onClick={e => e.target.tagName === "TD" ? modal.show(<PlayerStatsModal player={player.displayName} id={player.id} />) : null}>
            <td title={player.displayName} className={styles.VipName}>
                <div className={styles.VipRowImg}><img src={player.avatar} alt="" /></div>
                <span>{player.displayName}</span>
            </td>
            {/* <td className={styles.BanDisplayName}>{player.displayName}</td> */}
            <td title={t("server.banList.table.playerId")}>{player.id}</td>
            <td>{player.reason}</td>
            <td>{player.admin}</td>
            <td>{player.banned_until !== "" ? t("dateTime", { date: new Date(player.banned_until) }) : ""}</td>
            <td>{player.ban_timestamp !== "" ? t("dateTime", { date: new Date(player.ban_timestamp) }) : ""}</td>
            <th className={styles.listButton} data-oid={player.oid} data-platform={player.platform} data-name={player.displayName} data-id={player.id} onClick={props.callback}>
                {t("server.action.unban")}
            </th>
        </tr>
    );
}

export function FireStarter(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: starterList, error } = useQuery('serverStarterList' + sid, () => OperationsApi.getStarterList({ sid }));

    const [searchWord, setSearchWord] = useState("");
    const [sorting, setSorting] = useState("-amount");

    if (!starterList) {
        // TODO: add fake item list on loading
        return t("loading");
    } else {
        starterList.data = starterList.data.sort(DynamicSort(sorting));
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }

    return (
        <div>
            <h5>
                {t("server.firestarterList.description0")}<br />{t("server.firestarterList.description1")}
            </h5>
            <ButtonRow>
                <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                <ButtonUrl href={`https://manager-api.gametools.network/api/firestartersexcel?serverid=${props.sid}`} name={t("export")} />
            </ButtonRow>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <th onClick={_ => setSorting("playerName")}>{t("server.firestarterList.table.playerName")}</th>
                        <th onClick={_ => setSorting("playerId")}>{t("server.firestarterList.table.playerId")}</th>
                        <th onClick={_ => setSorting("-amount")}>{t("server.firestarterList.table.amount")}</th>
                    </thead>
                    <tbody>
                        {
                            starterList.data.filter(p => p.playerName.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<StarterRow player={player} key={i} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StarterRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();
    return (
        <tr className={styles.BanRow} onClick={_ => modal.show(<PlayerStatsModal player={player.playerName} id={player.playerId} />)}>
            <td className={styles.BanDisplayName}>{player.platoon !== "" ? `[${player.platoon}] ` : null}{player.playerName}</td>
            <td title={t("server.firestarterList.table.playerId")}>{player.playerId}</td>
            <td>{player.amount}</td>
        </tr>
    );
}

export function PlayTime(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: playTimeList, error } = useQuery('playTimeList' + sid, () => OperationsApi.getPlayTimeList({ sid }));

    const [searchWord, setSearchWord] = useState("");

    if (!playTimeList) {
        // TODO: add fake item list on loading
        return t("loading");
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }

    return (
        <div>
            <h5>
                {t("server.playTimeList.description0")}<br />{t("server.playTimeList.description1")}
            </h5>
            <ButtonRow>
                <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                <ButtonUrl href={`https://manager-api.gametools.network/api/playingscoreboardexcel?serverid=${props.sid}`} name={t("export")} />
            </ButtonRow>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <th>{t("server.playTimeList.table.playerName")}</th>
                        <th>{t("server.playTimeList.table.playerId")}</th>
                        <th>{t("server.playTimeList.table.timePlayed")}</th>
                    </thead>
                    <tbody>
                        {
                            playTimeList.data.filter(p => p.name.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<PlayTimeRow player={player} key={i} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PlayTimeRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();

    let hours = Math.floor(player.timePlayed / 3600);
    let onlyMins = player.timePlayed % 3600;
    let minutes = Math.floor(onlyMins / 60);

    // Local time
    let datetime = `${hours}:${("0" + minutes).slice(-2)}`;

    return (
        <tr className={styles.BanRow} onClick={_ => modal.show(<PlayerStatsModal player={player.name} id={player.playerId} />)}>
            <td className={styles.BanDisplayName}>{player.platoon !== "" ? `[${player.platoon}] ` : null}{player.name}</td>
            <td title={t("server.playTimeList.table.playerId")}>{player.playerId}</td>
            <td>{datetime}</td>
        </tr>
    );
}

export function Spectator(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: spectatorList, error } = useQuery('serverSpectatorList' + sid, () => OperationsApi.getSpectatorList({ sid }));

    const [searchWord, setSearchWord] = useState("");
    const [sorting, setSorting] = useState("name");

    if (!spectatorList) {
        // TODO: add fake item list on loading
        return t("loading");
    } else {
        spectatorList.data = spectatorList.data.sort(DynamicSort(sorting));
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }

    return (
        <div>
            <h5>
                {t("server.spectatorList.description0")}<br />{t("server.spectatorList.description1")}<br />{t("server.spectatorList.description2")}
            </h5>
            <ButtonRow>
                <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                <ButtonUrl href={`https://manager-api.gametools.network/api/spectatorsexcel?serverid=${props.sid}`} name={t("export")} />
            </ButtonRow>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <th onClick={_ => setSorting("name")}>{t("server.spectatorList.table.playerName")}</th>
                        <th onClick={_ => setSorting("playerId")}>{t("server.spectatorList.table.playerId")}</th>
                        <th onClick={_ => setSorting("-unixTimeStamp")}>{t("server.spectatorList.table.time")}</th>
                    </thead>
                    <tbody>
                        {
                            spectatorList.data.filter(p => p.name.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<SpectatorRow player={player} key={i} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SpectatorRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();


    // var datetime = new Date(Date.parse(player.timeStamp));
    var datetime = new Date(player.timeStamp);
    // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Local time
    // datetime = `${datetime.getUTCDate()} ${months[datetime.getMonth()]} ${datetime.getFullYear()} ${String(datetime.getHours()).padStart(2, '0')}:${String(datetime.getMinutes()).padStart(2, '0')}`;

    return (
        <tr className={styles.BanRow} onClick={_ => modal.show(<PlayerStatsModal player={player.name} id={player.playerId} />)}>
            <td className={styles.BanDisplayName}>{player.platoon !== "" ? `[${player.platoon}] ` : null}{player.name}</td>
            <td title={t("server.spectatorList.table.playerId")}>{player.playerId}</td>
            <td>{t("dateTime", { date: datetime })}</td>
        </tr>
    );
}

export function Playerlogs(props) {
    const sid = props.sid;
    const { t } = useTranslation();

    const [date, setDate] = useState("-");
    const [searchPlayer, setSearchPlayer] = useState("");
    const [searchField, setSearchField] = useState("");

    const { isError, data, error } = useQuery('serverPlayerLogList' + date + sid + searchPlayer, () => OperationsApi.getPlayerLogList({ sid, date, searchPlayer }));

    return (
        <div>
            <h5>
                {t("server.playerLogs.description0")}<br />{t("server.playerLogs.description1")}<br />{t("server.playerLogs.description2")}<br /><br />{t("server.playerLogs.description3")}
            </h5>
            <Row>
                <TextInput id="textInput" name={t("server.playerLogs.filterPlayer")} style={{ marginRight: "12px" }} callback={(v) => setSearchField(v.target.value)} />
                <ButtonRow>
                    <Button name="Search" disabled={searchField === ""} callback={() => setSearchPlayer(searchField)} />
                    <Button name="Reset" disabled={searchPlayer === ""} callback={() => {
                        setSearchPlayer("");
                        setSearchField("");
                        document.getElementsByTagName('input')[0].value = "";
                    }} />
                </ButtonRow>
            </Row>

            <PlayerLogInfo data={data} setDate={setDate} sid={sid} date={date} error={error} isError={isError} />
        </div>
    );
}

function PlayerLogInfo(props) {
    const { t } = useTranslation();
    const playerLogList = props.data
    const [dateIndex, setDateIndex] = useState(0);
    const [searchWord, setSearchWord] = useState("");

    if (props.isError) {
        return `Error, no info found for that playername`
    }

    if (!playerLogList) {
        // TODO: add fake item list on loading
        return t("loading");
    }

    playerLogList.data.sort((a, b) => b.amount - a.amount);

    let arrowLeft = (
        <svg className={styles.uiIcion} viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
        </svg>
    );

    let arrowRight = (
        <svg className={styles.uiIcion} viewBox="0 0 24 24">
            <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
    );

    return (
        <>
            <Row>
                <TextInput style={{ marginRight: "12px" }} name={t("server.playerLogs.search")} callback={(v) => setSearchWord(v.target.value)} />
                <ButtonRow>
                    <Button name="Left" content={arrowLeft} disabled={dateIndex === 0} callback={_ => { if (dateIndex !== 0) { setDateIndex(dateIndex - 1); props.setDate(playerLogList.intDates[dateIndex]) } }} />
                    <select className={buttonStyle.dropdownButton} value={dateIndex} onChange={event => { setDateIndex(parseInt(event.target.value)); props.setDate(playerLogList.intDates[dateIndex]) }}>
                        {playerLogList.dates.map((value, i) => {
                            var datetime = new Date(value);
                            return <option value={i} key={i}>{t("shortDateTime", { date: datetime })}</option>
                        })}
                    </select>
                    <Button name="Right" content={arrowRight} disabled={dateIndex === playerLogList.intDates.length} callback={_ => { if (dateIndex !== playerLogList.intDates.length) { setDateIndex(dateIndex + 1); props.setDate(playerLogList.intDates[dateIndex]) } }} />
                    <ButtonUrl href={`https://manager-api.gametools.network/api/playerloglistexcel?serverid=${props.sid}&date=${props.date}`} name={t("export")} />
                </ButtonRow>
            </Row>



            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <th>{t("server.playerLogs.table.playerName")}</th>
                        <th>{t("server.playerLogs.table.playerId")}</th>
                        <th>{t("server.playerLogs.table.ping")}</th>
                        <th>{t("server.playerLogs.table.role")}</th>
                    </thead>
                    <tbody>
                        {
                            playerLogList.data.filter(p => p.name.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<PlayerlogsRow player={player} key={i} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

function PlayerlogsRow(props) {
    const modal = useModal();
    const player = props.player;
    const { t } = useTranslation();

    return (
        <tr className={styles.BanRow} onClick={_ => modal.show(<PlayerStatsModal player={player.name} id={player.playerId} />)}>
            <td className={styles.BanDisplayName}>{player.platoon !== "" ? `[${player.platoon}] ` : null}{player.name}</td>
            <td title={t("server.playerLogs.table.playerId")}>{player.playerId}</td>
            <td>{player.ping}</td>
            <td>{player.role}</td>
        </tr>
    );
}

export function VipList(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: vipList, error } = useQuery('serverVipList' + sid, () => OperationsApi.getVipList({ sid }));

    const [searchWord, setSearchWord] = useState("");
    const [sorting, setSorting] = useState("displayName");

    const modal = useModal();
    const showUnvip = e => {
        let playerInfo = e.target.dataset
        modal.show(
            <ServerUnvipPlayer
                sid={sid}
                eaid={playerInfo.name}
                playerId={playerInfo.id}
            />
        );
    }

    if (!vipList) {
        // TODO: add fake item list on loading
        return t("loading");
    } else {
        vipList.data = vipList.data.sort(DynamicSort(sorting));
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }


    return (
        <div>
            <div className={styles.VipHeader}>
                <ButtonRow>
                    <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                    <ButtonUrl href={`https://manager-api.gametools.network/api/infoexcel?type=vipList&serverid=${props.sid}`} name={t("export")} />
                </ButtonRow>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h5 style={{ marginBottom: 0 }}>
                        {t("server.vipList.description0")}<br />
                        {t("server.vipList.description1")}<b>{t("server.vipList.description2", { number: vipList.data.length })}</b>.
                    </h5>
                </div>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <tr>
                            <th onClick={_ => setSorting("displayName")}>{t("server.vipList.table.playerName")}</th>
                            <th onClick={_ => setSorting("id")}>{t("server.vipList.table.playerId")}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            vipList.data.filter(p => p.displayName.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<VipRow player={player} key={i} callback={showUnvip} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function VipRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();
    return (
        <tr className={styles.VipRow} onClick={e => e.target.tagName === "TD" ? modal.show(<PlayerStatsModal player={player.displayName} id={player.id} />) : null}>
            <td title={player.displayName} className={styles.VipName}>
                <div className={styles.VipRowImg}><img src={player.avatar} alt="" /></div>
                <span>{player.displayName}</span>
            </td>
            <td title={t("server.vipList.table.playerId")}>{player.id}</td>
            <th className={styles.listButton} data-name={player.displayName} data-id={player.id} onClick={props.callback}>
                {t("server.action.removeVip")}
            </th>
        </tr>
    );
}


export function AdminList(props) {
    const sid = props.sid;
    const { t } = useTranslation();
    const { isError, data: adminList, error } = useQuery('serverAdminList' + sid, () => OperationsApi.getAdminList({ sid }));

    const [searchWord, setSearchWord] = useState("");
    const [sorting, setSorting] = useState("displayName");


    if (!adminList) {
        // TODO: add fake item list on loading
        return t("loading");
    } else {
        adminList.data = adminList.data.sort(DynamicSort(sorting));
    }

    if (isError) {
        return `Error ${error.code}: {error.message}`
    }


    return (
        <div>
            <div className={styles.VipHeader}>
                <ButtonRow>
                    <TextInput name={t("search")} callback={(v) => setSearchWord(v.target.value)} />
                    <ButtonUrl href={`https://manager-api.gametools.network/api/infoexcel?type=adminList&serverid=${props.sid}`} name={t("export")} />
                </ButtonRow>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h5 style={{ marginBottom: 0 }}>
                        {t("server.adminList.description0")}<br />
                        {t("server.adminList.description1")}<b>{t("server.adminList.description2", { number: adminList.data.length })}</b>.
                    </h5>
                </div>
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "8px" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead style={{ position: "sticky", top: "0" }}>
                        <tr>
                            <th onClick={_ => setSorting("displayName")}>{t("server.adminList.table.playerName")}</th>
                            <th onClick={_ => setSorting("id")}>{t("server.adminList.table.playerId")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminList.data.filter(p => p.displayName.toLowerCase().includes(searchWord.toLowerCase())).map(
                                (player, i) => (<AdminRow player={player} key={i} />)
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AdminRow(props) {
    const player = props.player;
    const modal = useModal();
    const { t } = useTranslation();
    return (
        <tr className={styles.VipRow} onClick={_ => modal.show(<PlayerStatsModal player={player.displayName} id={player.id} />)}>
            <td title={player.displayName} className={styles.VipName}>
                <div className={styles.VipRowImg}><img src={player.avatar} alt="" /></div>
                <span>{player.displayName}</span>
            </td>
            <td title={t("server.adminList.table.playerId")}>{player.id}</td>
        </tr>
    );
}