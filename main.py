from scrapers.kijiji.kijiji_scraper import scrape_kijiji


if __name__ == "__main__":


    results = scrape_kijiji(
        "iphone"
    )


    print("\nResults:")

    for item in results:

        print(
            item
        )
