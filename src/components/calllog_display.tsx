import React from "react"

interface Props {
    first_name: string,
    datetime: string,
    status: string,
    transcript: string,
    summary: string,
    concerns: string,
    follow_up: string
}

export const CallLog: React.FC<Props> = ({ first_name, datetime, status, transcript, summary, concerns, follow_up }) => {
    return (
        <>
            <div className="mb-1">
                <span className="text-2xl font-bold">Details about our call with {first_name} on {datetime}</span>
                {statusIcon(status)}
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 text-center">
                    <span className="text-xl">Call Summary</span><br/>
                    <span>{summary}</span>
                </div>
                <div className="border p-4 text-center">
                    <span className="text-xl">Call Transcript</span><br />
                    <span>{transcript}</span>
                </div>
                <div className="border p-4 text-center">
                    <span className="text-xl">Follow-ups Topics</span><br/>
                    <span>{follow_up}</span>
                </div>
                <div className="border p-4 text-center">
                    <span className="text-xl">Concerns</span><br/>
                    <span>{concerns}</span>
                </div>
            </div>
        </>
    )
}

const statusIcon = (status:string) => {
    let confirmedStyle = "bg-green-500 text-white rounded-lg max-w-[100px] p-1 m-0 text-center"
    let pendingStyle = "bg-yellow-500 text-white rounded-lg max-w-[100px] p-1 m-0 text-center"
    let missedStyle = "bg-red-500 text-white rounded-lg max-w-[100px] p-1 m-0 text-center"
    let rescheduledStyle = "bg-gray-500 text-white rounded-lg max-w-[100px] p-1 m-0 text-center"
    let currentStyle;
    let currentTitle;

    switch (status) {
        case "pending":
            currentStyle = pendingStyle;
            currentTitle = "Pending";
            break;
        case "confirmed":
            currentStyle = confirmedStyle;
            currentTitle = "Confirmed";
            break;
        case "missed":
            currentStyle = missedStyle;
            currentTitle = "Missed";
            break;
        case "rescheduled":
            currentStyle = rescheduledStyle;
            currentTitle = "Rescheduled";
            break;
    }

    return(
        <div className={currentStyle}><span>{currentTitle}</span></div>
    )
}