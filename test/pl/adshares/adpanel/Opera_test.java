package pl.adshares.adpanel;

import org.testng.annotations.Test;
import pl.adshares.adpanel.pages.PageOpera;
import pl.adshares.adpanel.setup.BrowserTestCase;

public class Opera_test extends BrowserTestCase {

  private PageOpera pageOpera;

  @Test
  public void opera() {
//    pageOpera = new AdvertiserMainPage(driver);
    pageOpera.operaTest();
  }
}
