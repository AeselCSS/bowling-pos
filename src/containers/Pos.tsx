

function Pos() {
    return (
        <>
            <div className=" flex flex-col border-2 w-96">
                <input type="text" placeholder="Booking ID" className="bg-gray-50 border border-gray-300 rounded-lg w-64 p-2.5 m-2.5"/>
                <div className="flex">
                    <input type="text" placeholder="E-mail" className="bg-gray-50 border border-gray-300 rounded-lg w-64 p-2.5 m-2.5"/>
                    <input type="button" value="Search" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"/>
                </div>
                
            </div>
        </>
    )
}

export default Pos;