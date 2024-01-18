
const defaultOptions = {
    animations: {
        easing: "linear",
        speed: 300,
    },
    sparkline: {
        enabled: false,
    },
    brush: {
        enabled: false,
    },
    id: "",
    fontFamily: "Inter, sans-serif",
    foreColor: "hsl(var(--nextui-default-800))",
    stacked: true,
    toolbar: {
        show: false,
    },
}

const ParseOptions = (type:string)=>{
    const options = {
        chart: {
            type: type,
            ...defaultOptions,
        }
    };
    switch (type) {
        case 'donut':{
            return  {...options};
        }
        case 'bar':{
            return  {...options};
        }
        default:
            break;
    }

    return options;
}

export default ParseOptions;