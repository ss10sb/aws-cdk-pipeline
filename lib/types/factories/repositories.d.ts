import { AbstractFactory } from "./abstract-factory";
import { Construct } from "@aws-cdk/core";
import { IRepository } from "@aws-cdk/aws-ecr";
import { ContainerImage } from "@aws-cdk/aws-ecs";
export declare enum RepositoryType {
    NGINX = "nginx",
    PHPFPM = "phpfpm",
    CLI = "cli"
}
export interface RepositoryFactoryProps {
    repositoryNames?: {
        [key in RepositoryType]?: string;
    };
    repositories?: RepositoryType[];
    imageTags?: {
        [key in RepositoryType]?: string;
    };
    createOnInit?: boolean;
}
export declare class Repositories extends AbstractFactory {
    readonly props: RepositoryFactoryProps;
    repos: {
        [key in RepositoryType]?: IRepository;
    };
    containerImages: {
        [key in RepositoryType]?: ContainerImage;
    };
    constructor(scope: Construct, id: string, props: RepositoryFactoryProps);
    getByName(name: RepositoryType): IRepository;
    repoEntries(): [RepositoryType, IRepository][];
    repoArray(): IRepository[];
    containerImageEntries(): [RepositoryType, ContainerImage][];
    getTagForImage(image: RepositoryType): string;
    setTagForImage(image: RepositoryType, tag: string): void;
    getContainerImage(image: RepositoryType): ContainerImage;
    ecrNames(): [RepositoryType, string][];
    getEcrName(name: RepositoryType): string;
    private create;
    private hasRepositoryNamesInProps;
    private hasRepositoriesInProps;
    private createNewRepositories;
    private createNewRepository;
    private fromRepositoryNames;
    private objEntries;
}
