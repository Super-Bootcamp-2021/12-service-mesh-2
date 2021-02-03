function main(argv) {
    switch (argv[2]) {
        case "basic":
            require("./basic/main");
            break;
        case "task":
                require("./task/main");
                break;
        default:
        console.log(argv[2]);
        process.stdout.write("available commmand are \n");
        process.stdout.write("- basic\n");
        process.stdout.write("- task\n");
        process.stdout.write(":D\n");
    }
}

main(process.argv);