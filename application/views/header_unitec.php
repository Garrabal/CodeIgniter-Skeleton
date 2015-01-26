<header class="navbar navbar-inverse navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <button data-target=".navbar-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="<?php echo site_url(); ?>" class="navbar-brand">Unitec</a>
        </div>
        <nav class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <? foreach ( $menu->elementos as $elem ) : 
                $segmentoUrl = ( $this->uri->segment( 1 ) == 'noticias') ? 'noticias/1' : $this->uri->segment( 1 ); ?>
                <li class="dropdown <?= ( $segmentoUrl == $elem->url ) ? 'active' : ''; ?>" >
                    <? if ( isset( $elem->menu ) ) : ?>
                        <a class="dropdown-toggle" data-toggle="dropdown" href="/<?= $elem->url ?>" >
                            <? if ( isset( $elem->icono ) ) : ?>
                                <span class="glyphicon glyphicon-<?= $elem->icono ?>"></span>&nbsp;
                            <? endif; ?>
                            <?= $elem->label ?> <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <? foreach ( $elem->menu as $subm ) : ?>
                                <li><a href="/<?= $subm->url ?>">
                                   <? if ( isset( $subm->icono ) ) : ?>
                                        <span class="glyphicon glyphicon-<?= $subm->icono ?>"></span>&nbsp;
                                    <? endif; ?>
                                    <?= $subm->label ?></a></li>
                            <? endforeach; ?>
                        </ul>
                    <? else : ?>
                        <a href="/<?= $elem->url ?>">
                            <? if ( isset( $elem->icono ) ) : ?>
                                <span class="glyphicon glyphicon-<?= $elem->icono ?>"></span>&nbsp;
                            <? endif; ?>
                        <?= $elem->label ?></a>
                    <? endif; ?>
                </li>
            <? endforeach; ?>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="<?= ( $segmentoUrl == 'login' ) ? 'active' : ''; ?>">
                <? if ( ! $this->ion_auth->logged_in() ) : ?>
                    <a href="<?= base_url('login') ?>" title="Entrar"><span class="glyphicon glyphicon-log-in"></span> Entrar</a>
                <? else : ?>
                    <a href="<?= base_url('logout') ?>" title="Salir"><span class="glyphicon glyphicon-log-out"></span> Salir</a>
                <? endif; ?>
                </li>
            </ul>
        </nav>
    </div>
</header>