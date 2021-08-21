import {AbstractFactory} from "./abstract-factory";
import {Construct, RemovalPolicy} from "@aws-cdk/core";
import {IRepository, Repository} from "@aws-cdk/aws-ecr";
import {ContainerImage} from "@aws-cdk/aws-ecs";

export enum RepositoryType {
    NGINX = 'nginx',
    PHPFPM = 'phpfpm',
    CLI = 'cli'
}

export interface RepositoryFactoryProps {
    repositoryNames?: { [key in RepositoryType]?: string };
    repositories?: RepositoryType[];
    imageTags?: { [key in RepositoryType]?: string };
    createOnInit?: boolean;
}

export class Repositories extends AbstractFactory {
    readonly props: RepositoryFactoryProps;
    repos: { [key in RepositoryType]?: IRepository } = {};
    containerImages: { [key in RepositoryType]?: ContainerImage } = {};

    constructor(scope: Construct, id: string, props: RepositoryFactoryProps) {
        super(scope, id);
        this.props = props;
        if (this.props.createOnInit ?? true) {
            this.create();
        }
    }

    getByName(name: RepositoryType): IRepository {
        //@ts-ignore
        return this.repos[name];
    }

    repoEntries(): [RepositoryType, IRepository][] {
        return this.objEntries(this.repos);
    }

    repoArray(): IRepository[] {
        let repos: IRepository[] = [];
        for (const [name, repo] of this.repoEntries()) {
            repos.push(repo);
        }
        return repos;
    }

    containerImageEntries(): [RepositoryType, ContainerImage][] {
        return this.objEntries(this.containerImages);
    }

    getTagForImage(image: RepositoryType): string {
        if (this.props.imageTags) {
            return this.props.imageTags[image] ?? 'latest';
        }
        return 'latest';
    }

    setTagForImage(image: RepositoryType, tag: string): void {
        if (!this.props.imageTags) {
            this.props.imageTags = {};
        }
        this.props.imageTags[image] = tag;
    }

    getContainerImage(image: RepositoryType): ContainerImage {
        if (!this.containerImages[image]) {
            //this.containerImages[image] = ContainerImage.fromRegistry(this.getByName(image).repositoryUri + ':' + this.getTagForImage(image));
            this.containerImages[image] = ContainerImage.fromEcrRepository(this.getByName(image), this.getTagForImage(image));
        }
        //@ts-ignore
        return this.containerImages[image];
    }

    ecrNames(): [RepositoryType, string][] {
        const names: { [key in RepositoryType]?: string } = {};
        if (this.hasRepositoryNamesInProps()) {
            for (const [key, name] of this.objEntries(this.props.repositoryNames ?? {})) {
                names[key] = name;
            }
        }
        if (this.hasRepositoriesInProps()) {
            for (const name of this.props.repositories ?? []) {
                names[name] = this.getEcrName(name);
            }
        }
        return this.objEntries(names);
    }

    getEcrName(name: RepositoryType): string {
        return `${this.id}/${name}`;
    }

    private create(): void {
        if (this.hasRepositoryNamesInProps()) {
            this.fromRepositoryNames(this.props.repositoryNames ?? {});
        }
        if (this.hasRepositoriesInProps()) {
            this.createNewRepositories(this.props.repositories ?? []);
        }
    }

    private hasRepositoryNamesInProps(): boolean {
        if (this.props.repositoryNames) {
            return Object.keys(this.props.repositoryNames).length > 0;
        }
        return false;
    }

    private hasRepositoriesInProps(): boolean {
        if (this.props.repositories) {
            return this.props.repositories.length > 0;
        }
        return false;
    }

    private createNewRepositories(repositories: RepositoryType[]): void {
        for (const name of repositories) {
            if (!this.repos[name]) {
                this.repos[name] = this.createNewRepository(name);
            }
        }
    }

    private createNewRepository(name: RepositoryType): IRepository {
        return new Repository(this.scope, `${name}-ecr`, {
            repositoryName: this.getEcrName(name),
            removalPolicy: RemovalPolicy.RETAIN,
            imageScanOnPush: true,
            lifecycleRules: [
                {
                    maxImageCount: 5
                }
            ]
        });
    }

    private fromRepositoryNames(repositoryNames: { [key in RepositoryType]?: string }): void {
        for (const [name, repoName] of this.objEntries(repositoryNames)) {
            this.repos[name] = Repository.fromRepositoryName(this.scope, `${name}-ecr`, repoName);
        }
    }

    private objEntries<O extends object, K = keyof O, V = O extends { [key: string]: infer L } ? L : never>(obj: O): Array<[K, V]> {
        return Object.entries(obj) as unknown as Array<[K, V]>;
    }
}
