"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repositories = exports.RepositoryType = void 0;
const abstract_factory_1 = require("./abstract-factory");
const core_1 = require("@aws-cdk/core");
const aws_ecr_1 = require("@aws-cdk/aws-ecr");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
var RepositoryType;
(function (RepositoryType) {
    RepositoryType["NGINX"] = "nginx";
    RepositoryType["PHPFPM"] = "phpfpm";
    RepositoryType["CLI"] = "cli";
})(RepositoryType = exports.RepositoryType || (exports.RepositoryType = {}));
class Repositories extends abstract_factory_1.AbstractFactory {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.repos = {};
        this.containerImages = {};
        this.props = props;
        if ((_a = this.props.createOnInit) !== null && _a !== void 0 ? _a : true) {
            this.create();
        }
    }
    getByName(name) {
        //@ts-ignore
        return this.repos[name];
    }
    repoEntries() {
        return this.objEntries(this.repos);
    }
    repoArray() {
        let repos = [];
        for (const [name, repo] of this.repoEntries()) {
            repos.push(repo);
        }
        return repos;
    }
    containerImageEntries() {
        return this.objEntries(this.containerImages);
    }
    getTagForImage(image) {
        var _a;
        if (this.props.imageTags) {
            return (_a = this.props.imageTags[image]) !== null && _a !== void 0 ? _a : 'latest';
        }
        return 'latest';
    }
    setTagForImage(image, tag) {
        if (!this.props.imageTags) {
            this.props.imageTags = {};
        }
        this.props.imageTags[image] = tag;
    }
    getContainerImage(image) {
        if (!this.containerImages[image]) {
            //this.containerImages[image] = ContainerImage.fromRegistry(this.getByName(image).repositoryUri + ':' + this.getTagForImage(image));
            this.containerImages[image] = aws_ecs_1.ContainerImage.fromEcrRepository(this.getByName(image), this.getTagForImage(image));
        }
        //@ts-ignore
        return this.containerImages[image];
    }
    ecrNames() {
        var _a, _b;
        const names = {};
        if (this.hasRepositoryNamesInProps()) {
            for (const [key, name] of this.objEntries((_a = this.props.repositoryNames) !== null && _a !== void 0 ? _a : {})) {
                names[key] = name;
            }
        }
        if (this.hasRepositoriesInProps()) {
            for (const name of (_b = this.props.repositories) !== null && _b !== void 0 ? _b : []) {
                names[name] = this.getEcrName(name);
            }
        }
        return this.objEntries(names);
    }
    getEcrName(name) {
        return `${this.id}/${name}`;
    }
    create() {
        var _a, _b;
        if (this.hasRepositoryNamesInProps()) {
            this.fromRepositoryNames((_a = this.props.repositoryNames) !== null && _a !== void 0 ? _a : {});
        }
        if (this.hasRepositoriesInProps()) {
            this.createNewRepositories((_b = this.props.repositories) !== null && _b !== void 0 ? _b : []);
        }
    }
    hasRepositoryNamesInProps() {
        if (this.props.repositoryNames) {
            return Object.keys(this.props.repositoryNames).length > 0;
        }
        return false;
    }
    hasRepositoriesInProps() {
        if (this.props.repositories) {
            return this.props.repositories.length > 0;
        }
        return false;
    }
    createNewRepositories(repositories) {
        for (const name of repositories) {
            if (!this.repos[name]) {
                this.repos[name] = this.createNewRepository(name);
            }
        }
    }
    createNewRepository(name) {
        return new aws_ecr_1.Repository(this.scope, `${name}-ecr`, {
            repositoryName: this.getEcrName(name),
            removalPolicy: core_1.RemovalPolicy.RETAIN,
            imageScanOnPush: true,
            lifecycleRules: [
                {
                    maxImageCount: 5
                }
            ]
        });
    }
    fromRepositoryNames(repositoryNames) {
        for (const [name, repoName] of this.objEntries(repositoryNames)) {
            this.repos[name] = aws_ecr_1.Repository.fromRepositoryName(this.scope, `${name}-ecr`, repoName);
        }
    }
    objEntries(obj) {
        return Object.entries(obj);
    }
}
exports.Repositories = Repositories;
//# sourceMappingURL=repositories.js.map