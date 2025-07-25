export type NavigationLink = {
    route: string;
    name: string;
    icon?: React.ReactNode;
}

export type NavigationSection = {
    links: NavigationLink[];
}

export class SectionBuilder {
    private readonly sections: NavigationSection[];

    constructor() {
        this.sections = [];
        this.nextSection();
    }

    private cleanLastEmptySection() {
        if (this.sections.length > 0 && this.currentSection().links.length === 0) {
            this.sections.pop();
        }
    }

    public nextSection() {
        this.cleanLastEmptySection();
        this.sections.push({ links: [] });
    }

    private currentSection() {
        return this.sections[this.sections.length - 1];
    }

    public addLinkToSection(link: NavigationLink) {
        this.currentSection().links.push(link);
    }

    public compile() {
        this.cleanLastEmptySection();
        return this.sections;
    }
}
