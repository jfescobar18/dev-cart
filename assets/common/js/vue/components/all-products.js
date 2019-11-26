var all_products = Vue.component('all-products', {
    props: {
        SearchWord: {
            default: ''
        },
        category: {
            default: 'all'
        },
        page: {
            default: 1
        },
        Categories: {
            default: {}
        },
        Products: {
            default: {}
        },
        FilteredProducts: {
            default: {}
        },
        CurrentPageProducts: {
            default: {}
        },
        TotalPages: {
            default: 1
        }
    },
    methods: {
        LogURL: function () {
            if (this.SearchWord.length === 0) {
                this.category = this.$route.params['category'];
                this.filterProductsByCategory();
            }
            else {
                this.searchProducts();
            }
        },
        loadCategories: function () {
            showLoader();
            this.$http.get(APIUrl() + 'AdminContent/GetCategories', {
                headers: {
                    APIKey: config.BusgarageAPIKey
                }
            }).then(
                response => {
                    this.Categories = response.body;
                    hideLoader();
                },
                err => {
                    console.log(err);
                    error_swal('Error...', 'Error interno estamos trabajando para solucionarlo');
                    hideLoader();
                }
            );
        },
        loadAllProducts: function () {
            showLoader();
            this.$http.get(APIUrl() + 'AdminContent/GetAllProducts', {
                headers: {
                    APIKey: config.BusgarageAPIKey
                }
            }).then(
                response => {
                    this.Products = response.body.map(function (x) {
                        x.Product_Price = formatMoney(x.Product_Price);
                        x.Product_Price_Total = formatMoney(x.Product_Price_Total);
                        x.Product_Img = APIUrl() + x.Product_Img;
                        return x
                    });

                    this.showProducts();
                    hideLoader();
                },
                err => {
                    console.log(err);
                    error_swal('Error...', 'Error interno estamos trabajando para solucionarlo');
                    hideLoader();
                }
            );
        },
        searchProducts: function () {
            showLoader();
            this.$http.get(APIUrl() + `AdminContent/Search_Products/${this.SearchWord}`, {
                headers: {
                    APIKey: config.BusgarageAPIKey
                }
            }).then(
                response => {
                    this.Products = response.body.map(function (x) {
                        x.Product_Price = formatMoney(x.Product_Price);
                        x.Product_Price_Total = formatMoney(x.Product_Price_Total);
                        x.Product_Img = APIUrl() + x.Product_Img;
                        return x
                    });

                    this.category = this.$route.params['category'];
                    this.showProducts();
                    hideLoader();
                },
                err => {
                    console.log(err);
                    error_swal('Error...', 'Error interno estamos trabajando para solucionarlo');
                    hideLoader();
                }
            );
        },
        showProducts: function () {
            this.page = 1;
            this.addActivePageNumber();

            if (this.category === undefined || this.category === 'all') {
                this.showAllProducts();
            }
            else {
                this.filterProductsByCategory();
            }
        },
        showAllProducts: function () {
            this.TotalPages = 1;

            for (let i = 0; i < this.Products.length; i++) {
                this.Products[i].Product_Page = this.TotalPages;
                if ((i + 1) % 12 == 0) {
                    this.TotalPages++;
                }
            }

            this.FilteredProducts = this.Products;

            this.CurrentPageProducts = this.FilteredProducts.filter(function (product) {
                return product.Product_Page === 1;
            });
        },
        filterProductsByCategory: function () {
            if (this.category === undefined || this.category === 'all') {
                this.showAllProducts();
            }
            else {
                let cat = parseInt(this.category);
                this.FilteredProducts = this.Products.filter(function (product) {
                    return product.Category_Id === cat;
                });

                this.TotalPages = 1;
                for (let i = 0; i < this.FilteredProducts.length; i++) {
                    this.FilteredProducts[i].Product_Page = this.TotalPages;
                    if ((i + 1) % 12 == 0) {
                        this.TotalPages++;
                    }
                }

                this.CurrentPageProducts = this.FilteredProducts.filter(function (product) {
                    return product.Product_Page === 1;
                });
            }
        },
        goToPage: function (page) {
            this.page = page;

            this.CurrentPageProducts = this.FilteredProducts.filter(function (product) {
                return product.Product_Page === page;
            });
            this.addActivePageNumber();
        },
        addActivePageNumber: function () {
            var page = this.page;
            var pageNumbers = document.getElementsByClassName('pagenumber');
            var currentNumber = document.getElementById(`page${page}`);

            for (let i = 0; i < pageNumbers.length; i++) {
                pageNumbers[i].className = pageNumbers[i].className.replace(/\bactive\b/g, "");
            }
            currentNumber.className += ' active';

            var first = document.getElementById('prev');
            var last = document.getElementById('next');
            if (this.page === 1 || this.page === undefined) {
                first.className += ' first-page';
            }
            else {
                first.className = first.className.replace(/\bfirst-page\b/g, "");
            }

            if (this.page === this.TotalPages && this.TotalPages >= 1) {
                last.className += ' last-page';
            }
            else {
                last.className = last.className.replace(/\blast-page\b/g, "");
            }
        },
        nextPage: function () {
            this.page++;
            this.goToPage(this.page);
        },
        prevPage: function () {
            this.page--;
            this.goToPage(this.page);
        }
    },
    template: `
        <div>
            <div class="all-products">
                <h1 v-if="SearchWord.length === 0">Categorias</h1>
                <h1 v-else>Resultados</h1>
                <div v-if="SearchWord.length === 0" class="categories">
                    <router-link class="show-all" to="/shop/all">Todos los productos</router-link>
                    <router-link v-for="category in Categories" class="" v-bind:to="'/shop/' + category.Category_Id +''">{{ category.Category_Name }}</router-link>
                </div>

                <div class="products">
                    <product-card v-for="product in CurrentPageProducts" v-bind:Product="product" class="card"></product-card>
                </div>

                <div class="navigation">
                    <i id="prev" class="fas fa-chevron-circle-left" v-on:click="prevPage"></i>
                        <a v-for="n in TotalPages" href="#" v-on:click.prevent="goToPage(n)" v-bind:id="'page' + n" class="pagenumber">{{ n }}</a>
                    <i id="next" class="fas fa-chevron-circle-right" v-on:click="nextPage"></i>
                </div>
            </div>
        </div>
    `,
    watch: {
        '$route': function (to, from) {
            this.LogURL();
        }
    },
    mounted() {
        if (this.SearchWord.length === 0) {
            this.loadCategories();
            this.loadAllProducts();
        }
        else {
            this.searchProducts();
        }
    }
});

export default all_products;