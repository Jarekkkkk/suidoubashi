import { round_down_week } from '@/Utils/vsdb';
import * as styles from './index.styles'
import { useEffect, useState } from 'react';
import React from 'react';
const CountDownClock = () => {
    const calculateCountdown = () => {
        const now = new Date()
        const currentDayOfWeek = now.getUTCDay() // 0 (Sunday) to 6 (Saturday)

        // Calculate the number of days until the next Wednesday
        const daysUntilWednesday = (3 - currentDayOfWeek + 7) % 7

        // Create a target date for the next Wednesday at 23:59 UTC
        const targetDate = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() + daysUntilWednesday,
                23,
                59,
                0,
            ),
        )
        // Calculate the time difference
        // @ts-ignore
        const timeDifference = targetDate - now

        // Calculate hours, minutes, and seconds
        const days = Math.floor((timeDifference / (1000 * 60 * 60 * 24)) % 7)
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
        const seconds = Math.floor((timeDifference / 1000) % 60)

        return { days, hours, minutes, seconds }
    }
    const [countdown, setCountdown] = useState(calculateCountdown())

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateCountdown())
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])
    return <div className={styles.infoContent}>
        <div className={styles.infoTitle}>
            Epoch {round_down_week(Date.now() / 1000) / 604800 - 2806}
        </div>
        <div>
            <div>Finished in </div>
            <div
                className={styles.yellowText}
            >{`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}</div>
        </div>
    </div>

};

export default React.memo(CountDownClock)