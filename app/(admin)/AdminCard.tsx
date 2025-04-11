import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { IconType } from "react-icons/lib";

interface Props {
  title: string;
  href: string;
  Icon: IconType;
}

const AdminCard = ({ title, href, Icon }: Props) => {
  return (
    <Card className="text-stone-200">
      <CardHeader>
        <CardTitle>
          <Link href={href}>{title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Icon className="h-12 w-12 justify-self-end items-end" />
      </CardContent>
    </Card>
  );
};

export default AdminCard;
