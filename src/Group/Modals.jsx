import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import { checkGameString } from "../Server/Modals";
import { supportedGames } from "../Globals";

import styles from "./Group.module.css";
import { OperationsApi } from "../api";
import { Switch, useModal, ButtonRow, Button, TextInput, ButtonUrl } from "../components";
import '../locales/config';

import { useUser } from "../Server/Manager";


export function ChangeAccountModal({ group, gid, cookie, user, callback }) {

    var allowedTo = false;
    if (group && user) allowedTo = group.isOwner || user.auth.isDeveloper;

    const showDeleteAccount = e => {
        modal.show(
            <GroupRemoveAccount
                gid={gid}
                cookie={cookie}
                group={group}
            />
        );
    }

    const modal = useModal();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [sid, setSid] = useState("");
    const [remid, setRemid] = useState("");
    const [defaultCookie, setDefaultCookie] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);
    const [supportedGame, setSupportedGame] = useState("bf1");
    const currentDefault = group.defaultCookie === cookie.id;

    useEffect(() => {
        if (cookie) {
            if (remid !== cookie.remid)
                setRemid(cookie.remid);
            if (sid !== cookie.sid)
                setSid(cookie.sid);
            if (defaultCookie !== currentDefault)
                setDefaultCookie(currentDefault)
        }
    }, [cookie]);

    const editCookies = useMutation(
        variables => OperationsApi.editCookie(variables),
        {
            onMutate: async () => {
                setApplyStatus(true);
            },
            onSuccess: async () => {
                setApplyStatus(null);
            },
            onError: async () => {
                setApplyStatus(false);
                setTimeout(_ => setApplyStatus(null), 2000);
            },
            onSettled: async () => {
                queryClient.invalidateQueries('groupId' + gid);
                callback();
            }
        }
    );

    return (
        <>
            <h2 style={{ marginLeft: "20px" }}>
                {t("group.account.main")}: {cookie.username}
            </h2>
            <h5>
                {t("cookie.remid")}
            </h5>
            <TextInput type="password" autocomplete="new-password" disabled={!allowedTo} callback={(e) => setRemid(e.target.value)} defaultValue={remid} name={"Remid"} />
            <h5>
                {t("cookie.sid")}
            </h5>
            <TextInput type="password" autocomplete="new-password" disabled={!allowedTo} callback={(e) => setSid(e.target.value)} defaultValue={sid} name={"Sid"} />
            <h5>
                {t("cookie.check")}
            </h5>
            <ButtonRow>
                <select className={styles.SmallSwitch} style={{ marginLeft: "20px", marginBottom: "10px" }} value={supportedGame} onChange={(e) => setSupportedGame(e.target.value)}>
                    {supportedGames.map((element, index) => {
                        return (
                            <option key={index} value={element}>{t(`games.${element}`)}</option>
                        )
                    })}
                </select>
            </ButtonRow>
            <Switch checked={defaultCookie} name={t("cookie.setDefaultCookie")} callback={(v) => setDefaultCookie(v)} />
            <ButtonRow>
                <ButtonUrl href={`/cookieinfo`} name={t("cookieInfo.link")} />
            </ButtonRow>
            <ButtonRow>
                {
                    (group && (sid !== cookie.sid || remid !== cookie.remid || defaultCookie !== currentDefault)) ? (
                        <Button name={t("apply")} disabled={!allowedTo || applyStatus !== null} callback={
                            _ => editCookies.mutate(
                                {
                                    gid: gid,
                                    sid: sid,
                                    remid: remid,
                                    id: cookie.id,
                                    defaultCookie: defaultCookie,
                                    supportedGame: supportedGame
                                }
                            )
                        } status={applyStatus} />
                    ) : ""
                }
                <Button style={{ color: "#FF7575" }} name={t("cookie.delete")} callback={showDeleteAccount} disabled={!allowedTo || currentDefault} />
            </ButtonRow>
        </>
    )
}


export function AddAccountModal({ group, gid, user, callback }) {

    var allowedTo = false;
    if (group && user) allowedTo = group.isOwner || user.auth.isDeveloper;

    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [sid, setSid] = useState("");
    const [remid, setRemid] = useState("");
    const [defaultCookie, setDefaultCookie] = useState(false);
    const [applyStatus, setApplyStatus] = useState(null);
    const [supportedGame, setSupportedGame] = useState("bf1");


    const addCookies = useMutation(
        variables => OperationsApi.addCookie(variables),
        {
            onMutate: async () => {
                setApplyStatus(true);
            },
            onSuccess: async () => {
                setApplyStatus(null);
            },
            onError: async () => {
                setApplyStatus(false);
                setTimeout(_ => setApplyStatus(null), 2000);
            },
            onSettled: async () => {
                queryClient.invalidateQueries('groupId' + gid);
                callback();
            }
        }
    );

    return (
        <>
            <h2 style={{ marginLeft: "20px" }}>
                {t("group.account.main")}
            </h2>
            <h5>
                {t("cookie.remid")}
            </h5>
            <TextInput type="password" autocomplete="new-password" disabled={!allowedTo} callback={(e) => setRemid(e.target.value)} defaultValue={remid} name={"Remid"} />
            <h5>
                {t("cookie.sid")}
            </h5>
            <TextInput type="password" autocomplete="new-password" disabled={!allowedTo} callback={(e) => setSid(e.target.value)} defaultValue={sid} name={"Sid"} />
            <h5>
                {t("cookie.check")}
            </h5>
            <ButtonRow>
                <select className={styles.SmallSwitch} style={{ marginLeft: "20px", marginBottom: "10px" }} value={supportedGame} onChange={(e) => setSupportedGame(e.target.value)}>
                    {supportedGames.map((element, index) => {
                        return (
                            <option key={index} value={element}>{t(`games.${element}`)}</option>
                        )
                    })}
                </select>
            </ButtonRow>
            <Switch checked={defaultCookie} name={t("cookie.setDefaultCookie")} callback={(v) => setDefaultCookie(v)} />
            <ButtonRow>
                <ButtonUrl href={`/cookieinfo`} name={t("cookieInfo.link")} />
            </ButtonRow>
            <ButtonRow>
                {
                    (group && (sid !== "" && remid !== "")) ? (
                        <Button name={t("cookie.add")} disabled={!allowedTo || applyStatus !== null} callback={
                            _ => addCookies.mutate(
                                {
                                    gid: gid,
                                    sid: sid,
                                    remid: remid,
                                    defaultCookie: defaultCookie,
                                    supportedGame: supportedGame
                                }
                            )
                        } status={applyStatus} />
                    ) : ""
                }
            </ButtonRow>
        </>
    )
}

export function GroupGlobalUnbanPlayer(props) {

    var { gid, eaid, playerId } = props;

    const modal = useModal();
    const { t } = useTranslation();
    const [reason, setReason] = useState("");
    const [banApplyStatus, setBanApplyStatus] = useState(null);
    const [errorUpdating, setError] = useState({ code: 0, message: "Unknown" });
    const { isError: userGettingError, data: user } = useUser();

    const UnbanPlayer = useMutation(
        v => OperationsApi.globalUnbanPlayer(v),
        {
            onMutate: async () => {
                setBanApplyStatus(true)
            },
            onError: (error) => {
                setBanApplyStatus(false);
                setError(error);
                setTimeout(_ => setBanApplyStatus(null), 3000);
            },
            onSuccess: () => {
                setBanApplyStatus(null);
                modal.close();
            },
        }
    );

    var perm = null;

    if (user) {
        user.permissions.isAdminOf.map(
            group => {
                if (gid === group.id) {
                    perm = gid
                }
            }
        )
    }


    const isDisabled =
        reason === "" ||
        banApplyStatus !== null ||
        userGettingError || !user || perm == null;

    const checkReason = (v) => (checkGameString(v)) ? setReason(v) : false;

    return (
        <>
            <h2 style={{ marginLeft: "20px" }}>{t("server.vUnbanMenu.main", { name: props.eaid })} </h2>
            <h5 style={{ maxWidth: "300px" }} >{t("server.vUnbanMenu.reasonDescription")}</h5>
            <TextInput value={reason} name={t("server.vUnbanMenu.reason")} callback={(e) => checkReason(e.target.value)} />
            <ButtonRow>
                <Button
                    name={t("server.vUnbanMenu.confirm")}
                    style={{ maxWidth: "144px" }}
                    disabled={isDisabled}
                    callback={() => {
                        UnbanPlayer.mutate({ gid, eaid, reason, name: props.eaid, playerId });
                    }}
                    status={banApplyStatus} />
                <h5 style={{ marginBottom: 0, alignSelf: "center", opacity: (banApplyStatus === false) ? 1 : 0 }}>Error {errorUpdating.code}: {errorUpdating.message}</h5>
            </ButtonRow>
        </>
    );
}

export function GroupRemoveAccount(props) {

    var { gid, cookie, group } = props;

    const modal = useModal();
    const { t } = useTranslation();
    const [removeApplyStatus, setRemoveApplyStatus] = useState(null);
    const [errorUpdating, setError] = useState({ code: 0, message: "Unknown" });
    const { isError: userGettingError, data: user } = useUser();

    const RemoveAccount = useMutation(
        v => OperationsApi.removeCookie(v),
        {
            onMutate: async () => {
                setRemoveApplyStatus(true)
            },
            onError: (error) => {
                setRemoveApplyStatus(false);
                setError(error);
                setTimeout(_ => setRemoveApplyStatus(null), 3000);
            },
            onSuccess: () => {
                setRemoveApplyStatus(null);
                modal.close();
            },
        }
    );

    var perm = null;

    if (user) {
        user.permissions.isAdminOf.map(
            group => {
                if (gid === group.id) {
                    perm = gid
                }
            }
        )
    }


    const isDisabled =
        removeApplyStatus !== null ||
        userGettingError || !user || perm == null;

    return (
        <>
            <h2 style={{ marginLeft: "20px" }}>{t("cookie.removeMenu.main", { name: cookie.username })} </h2>
            <ButtonRow>
                <Button
                    name={t("cookie.removeMenu.confirm")}
                    style={{ maxWidth: "144px" }}
                    disabled={isDisabled}
                    callback={() => {
                        RemoveAccount.mutate({ gid, id: cookie.id });
                    }}
                    status={removeApplyStatus} />
                <h5 style={{ marginBottom: 0, alignSelf: "center", opacity: (removeApplyStatus === false) ? 1 : 0 }}>Error {errorUpdating.code}: {errorUpdating.message}</h5>
            </ButtonRow>
        </>
    );
}