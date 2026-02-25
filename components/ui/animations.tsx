"use client";

import { motion } from "framer-motion";

export const FadeIn = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const SlideIn = ({
    children,
    delay = 0,
    direction = "left",
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    direction?: "left" | "right" | "up" | "down";
    className?: string;
}) => {
    const directionMap = {
        left: { x: -40, y: 0 },
        right: { x: 40, y: 0 },
        up: { x: 0, y: 40 },
        down: { x: 0, y: -40 },
    };
    const initial = directionMap[direction];

    return (
        <motion.div
            initial={{ opacity: 0, ...initial }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.12,
                    },
                },
                hidden: {},
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: "easeOut",
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const ScaleIn = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const GlowText = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`gradient-text ${className}`}
        >
            {children}
        </motion.span>
    );
};

export const PageHeader = ({
    title,
    description,
    className = "",
}: {
    title: string;
    description?: string;
    className?: string;
}) => {
    return (
        <div className={`mb-12 ${className}`}>
            <FadeIn>
                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                    <span className="gradient-text">{title}</span>
                </h1>
            </FadeIn>
            {description && (
                <FadeIn delay={0.1}>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </FadeIn>
            )}
        </div>
    );
};
