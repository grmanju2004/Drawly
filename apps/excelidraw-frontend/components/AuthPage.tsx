"use client";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded-2xl">
            <div className="p-2">
                <input type="text" placeholder="Email" />
            </div>
            
            <div className="p-2">
                <input type="password" placeholder="Password" />
            </div>

            <div className="p-2">
                <button onClick={() => {

                }}>{ isSignin ? "Sign In" : "Sign Up" }</button>
            </div>

        </div>
    </div>
}