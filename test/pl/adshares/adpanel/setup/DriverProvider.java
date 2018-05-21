package pl.adshares.adpanel.setup;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class DriverProvider {


  private static WebDriver driver;

  private DriverProvider() {
  }

  static WebDriver getWebDriver() {
    if (driver == null) {
      System.setProperty("webdriver.chrome.driver", "C:\\var\\git\\adpanel\\build\\drivers\\chromedriver-windows-32bit.exe");
      ChromeOptions chromeOptions = new ChromeOptions();
//      chromeOptions.setBinary("build/drivers/chromedriver-windows-32bit.exe");
      chromeOptions.addArguments("--start-maximized");
      driver = new ChromeDriver(chromeOptions);
      driver.get("http://panel.ads");
    }
    return driver;
  }

  static void close() {
    if (driver != null) {
      driver.quit();
      driver = null;
    }
  }
}
