export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-2xl">⏳</div>
                </div>
            </div>
        </div>
    );
}
