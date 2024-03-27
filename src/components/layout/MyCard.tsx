import React from "react";
import {Card, CardBody} from "@nextui-org/react";

interface Props {
    children: React.ReactNode;
    className?: string;
}
export const MyCard = ({ children, className }: Props) => {
    return (
        <Card className={"bg-default-50 rounded-xl shadow-md px-3 "+className}>
            <CardBody className="py-5 gap-4">
                {children}
            </CardBody>
        </Card>
    );
};

