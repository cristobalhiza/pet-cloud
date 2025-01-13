"use client";

import React from "react";

export default function EventModal({
    children,
    onClose,
    title,
}: {
    children: React.ReactNode;
    onClose: () => void;
    title?: string;
}) {
    return (
        <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-dark p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-black font-bold bg-orange p-2 rounded-full hover:bg-beige"
                >
                    ✕
                </button>

                {title && (
                    <h2 className="text-lg sm:text-xl font-bold text-dark mb-4 sm:mb-6 text-center">
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>
    );
}
