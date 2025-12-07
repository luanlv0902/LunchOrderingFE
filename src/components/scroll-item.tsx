import React, { useRef, useState } from "react";

interface DragScrollProps {
    children: React.ReactNode;
    className?: string;
}

const DragScroll: React.FC<DragScrollProps> = ({ children, className }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);


    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDown(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDown(false);
    const handleMouseUp = () => setIsDown(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !containerRef.current) return;
        e.preventDefault();

        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // tốc độ kéo
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;
        setStartX(e.touches[0].pageX);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!containerRef.current) return;
        const x = e.touches[0].pageX;
        const walk = x - startX;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ cursor: isDown ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            {children}
        </div>
    );
};

export default DragScroll;
