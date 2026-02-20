export const Scheduler = ({ initialAppointments }: any) => {
    return (
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="bg-gray-100 p-2 text-center font-bold text-sm">
                    {day}
                </div>
            ))}
            <div className="min-h-[150px] bg-white p-2 hover:bg-blue-50 transition-colors cursor-pointer group">
                <span className="text-xs text-gray-400 font-mono">09:00 AM</span>
                <div className="mt-2 p-2 bg-blue-100 border-l-4 border-blue-500 rounded text-xs">
                    Patient: John Doe (Check-up)
                </div>
            </div>
        </div>
    )
}