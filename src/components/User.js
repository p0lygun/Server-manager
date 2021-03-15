import React from "react";
import styles from "./User.module.css";

export function UserRow(props) {
    var user = props.discord;
    return (
        <div className={styles.UserRow}>
            <img alt="" src={user.avatar} className={styles.Avatar} />
            <div className={styles.DiscordName}>
                {user.name}
                <span className={styles.DiscordNum}>
                    {user.discriminator}
                </span>
            </div>
            <div className={styles.secure}>
                <svg viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12C6.39782 12 6.77935 11.842 7.06066 11.5607C7.34196 11.2794 7.5 10.8978 7.5 10.5C7.5 9.6675 6.825 9 6 9C5.60217 9 5.22064 9.15804 4.93934 9.43934C4.65804 9.72065 4.5 10.1022 4.5 10.5C4.5 10.8978 4.65804 11.2794 4.93934 11.5607C5.22064 11.842 5.60217 12 6 12ZM10.5 5.25C10.8978 5.25 11.2794 5.40804 11.5607 5.68934C11.842 5.97065 12 6.35218 12 6.75V14.25C12 14.6478 11.842 15.0294 11.5607 15.3107C11.2794 15.592 10.8978 15.75 10.5 15.75H1.5C1.10218 15.75 0.720644 15.592 0.43934 15.3107C0.158035 15.0294 0 14.6478 0 14.25V6.75C0 5.9175 0.675 5.25 1.5 5.25H2.25V3.75C2.25 2.75544 2.64509 1.80161 3.34835 1.09835C4.05161 0.395088 5.00544 0 6 0C6.49246 0 6.98009 0.0969967 7.43506 0.285452C7.89003 0.473907 8.30343 0.75013 8.65165 1.09835C8.99987 1.44657 9.27609 1.85997 9.46455 2.31494C9.653 2.76991 9.75 3.25754 9.75 3.75V5.25H10.5ZM6 1.5C5.40326 1.5 4.83097 1.73705 4.40901 2.15901C3.98705 2.58097 3.75 3.15326 3.75 3.75V5.25H8.25V3.75C8.25 3.15326 8.01295 2.58097 7.59099 2.15901C7.16903 1.73705 6.59674 1.5 6 1.5Z" fill="#55F165" />
                </svg>
                Logged in
            </div>
        </div>
    );
}

export function UserStRow(props) {
    var user = props.user;
    var dateAdded = new Date(Date.parse(user.addedAt));

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dateString = `${dateAdded.getUTCDate()} ${months[dateAdded.getUTCMonth()]} ${dateAdded.getUTCHours()}:${dateAdded.getUTCMinutes()}`;
    return (
        <div className={styles.UserRowSt}>
            <div className={styles.DiscordName}>
                {user.name}
            </div>
            <div className={styles.DateAdded}>
                {dateString}
            </div>
            <div className={styles.DiscordId}>
                {user.id}
            </div>
            {props.button}
        </div>
    );
}

export function FakeUserStRow(props) {
    return (
        <div className={styles.UserRowSt} />
    );
}
