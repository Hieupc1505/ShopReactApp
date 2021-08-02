const CarouselEmpty = () => {
    return (
        <div className="carousel">
            <div className="carousel-inner ">
                <div className="carousel-slide carousel-slide-ept"></div>
            </div>
            <div className="carousel-control">
                <span className="ctl pre">
                    <i className="ctl-icon small fas fa-arrow-left"></i>
                </span>
                <span className="ctl next">
                    <i className="ctl-icon small fas fa-arrow-right"></i>
                </span>
            </div>
        </div>
    );
};

export default CarouselEmpty;
