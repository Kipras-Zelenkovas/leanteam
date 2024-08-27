import { useNavigate } from "react-router-dom";

export const Page500 = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-wrap h-full w-full justify-center items-center bg-gray-100">
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800">
                        500
                    </h1>
                    <p className="text-center text-gray-500">
                        Internal Server Error
                    </p>
                    <p className="text-center text-gray-500">
                        Vidinė serverio klaida
                    </p>
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded"
                        >
                            Grįžti - Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
