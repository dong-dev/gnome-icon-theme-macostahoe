
export class DesktopEnvironment {
    name: string = "";
    constructor(name: string) {
        this.name = name;
    }
    public static KDE: DesktopEnvironment = new DesktopEnvironment("KDE");
    public static Gnome: DesktopEnvironment = new DesktopEnvironment("Gnome");
}