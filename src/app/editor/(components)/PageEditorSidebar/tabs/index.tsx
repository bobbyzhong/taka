import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SettingsIcon, SquareStackIcon } from "lucide-react";

type Props = {};
function TabList({}: Props) {
    return (
        <TabsList className="flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4">
            <TabsTrigger
                value="Settings"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <SettingsIcon />
            </TabsTrigger>
            <TabsTrigger
                value="Components"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <Plus />
            </TabsTrigger>

            <TabsTrigger
                value="Layers"
                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
                <SquareStackIcon />
            </TabsTrigger>
        </TabsList>
    );
}
export default TabList;
