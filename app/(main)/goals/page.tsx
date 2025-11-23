'use client';

export default function GoalsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-ios-primary">My Goals</h1>

            <div className="grid grid-cols-2 gap-4">
                {/* Placeholder Goal Cards */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="ios-card aspect-square flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50" />
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm mx-auto text-2xl">
                                🎯
                            </div>
                            <p className="font-medium text-ios-primary text-sm">Goal {i}</p>
                        </div>
                    </div>
                ))}

                {/* Add New Goal Card */}
                <div className="ios-card aspect-square flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 bg-transparent hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="text-green-600 font-medium text-sm">Add Wish</span>
                </div>
            </div>
        </div>
    );
}
